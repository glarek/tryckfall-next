export const actions = {
	// ---> LÄGG TILL DENNA NYA ACTION <---
	testAction: async () => {
		console.log('--- TEST ACTION KÖRS ---');
		const testData = {
			message: 'Hej från test action!',
			timestamp: Date.now()
		};
		console.log('--- RETURNERAR:', testData);
		return { testData }; // Returnerar ett objekt med en nyckel 'testData'
	}
};
