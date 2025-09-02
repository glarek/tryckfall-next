let showNavbar = $state(false); // Startvärde, kan vara true eller false

export function getShowNavbar() {
	return showNavbar;
}

export function toggleNavbar() {
	showNavbar = !showNavbar;
}

// Om du vill tillåta extern inställning av tillståndet (t.ex. stänga navbaren från ett annat ställe):
export function setShowNavbar(value) {
	showNavbar = value;
}
