// src/components/svelte/pressure-drop/calculations.js

/**
 * Calculates the Darcy friction factor using the Colebrook-White equation.
 * Uses an efficient approximation method by Didier Clamond.
 * See: Efficient resolution of the Colebrook equation, Didier Clamond
 * Laboratoire J.-A. Dieudonné, 06108 Nice cedex 02, France
 * E-Mail: didierc@unice.fr
 *
 * @param {number} Re Reynolds number (dimensionless)
 * @param {number} k Roughness divided by hydraulic diameter (e/D, dimensionless)
 * @returns {number} Darcy friction factor (f)
 */
export function colebrook(R, K) {
    /*See Efficient resolution of the Colebrook equation
    Didier Clamond
    Laboratoire J.-A. DieudonnÂ´e, 06108 Nice cedex 02, France
    E-Mail: didierc@unice.fr */
    let X1, X2, F, E
    X1 = K * R * 0.123968186335418
    X2 = Math.log(R) - 0.779397488455682
    F = X2 - 0.2
    E = (Math.log(X1 + F) + F - X2) / (1 + X1 + F)
    F = F - ((1 + X1 + F + 0.5 * E) * E * (X1 + F)) / (1 + X1 + F + E * (1 + E / 3))
    E = (Math.log(X1 + F) + F - X2) / (1 + X1 + F)
    F = F - ((1 + X1 + F + 0.5 * E) * E * (X1 + F)) / (1 + X1 + F + E * (1 + E / 3))
    F = 1.15129254649702 / F
    return F * F
}

export function calculatePressureDrop(dynamicViscosity, density, diameter, velocity, reynoldsNumber, darcyFrictionFactor, transitionLimit, transitionInterval) {
    let pressureDrop
    let pressureDropLaminar
    let pressureDropTurbulent
    let factor

    // If laminar flow
    if (reynoldsNumber < transitionLimit - transitionInterval) {
        pressureDrop = (32 * dynamicViscosity * velocity) / diameter ** 2
    }
    // If mixed type of flow
    else if (reynoldsNumber > transitionLimit - transitionInterval && reynoldsNumber < transitionLimit + transitionInterval) {
        factor = (reynoldsNumber - (transitionLimit - transitionInterval)) / (transitionInterval * 2)
        pressureDropLaminar = (32 * dynamicViscosity * velocity) / diameter ** 2
        pressureDropTurbulent = (darcyFrictionFactor * density * velocity ** 2) / (2 * diameter)
        pressureDrop = factor * pressureDropTurbulent + (1 - factor) * pressureDropLaminar
    }
    // If turbulent flow
    else {
        pressureDrop = (darcyFrictionFactor * density * velocity ** 2) / (2 * diameter)
    }
    return pressureDrop
}

// Du kan lägga till fler beräkningsfunktioner här om det behövs
