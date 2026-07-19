// Limpia localStorage entre tests para evitar contaminación de caché y cesta
beforeEach(() => {
  cy.clearLocalStorage()
})
