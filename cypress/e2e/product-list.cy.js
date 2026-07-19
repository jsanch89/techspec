const API = 'https://itx-frontend-test.onrender.com'

describe('Listado de productos', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/api/product`, { fixture: 'products.json' }).as('getProducts')
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('muestra el título y los productos', () => {
    cy.contains('h1', 'Smartphones').should('be.visible')
    cy.contains('Nokia').should('be.visible')
    cy.contains('3310 4G').should('be.visible')
    cy.contains('iPhone 15 Pro').should('be.visible')
    cy.contains('Galaxy S24').should('be.visible')
  })

  it('filtra por marca en tiempo real', () => {
    cy.get('[aria-label="Buscar productos"]').type('samsung')
    cy.contains('Galaxy S24').should('be.visible')
    cy.contains('iPhone 15 Pro').should('not.exist')
    cy.contains('3310 4G').should('not.exist')
  })

  it('filtra por modelo en tiempo real', () => {
    cy.get('[aria-label="Buscar productos"]').type('iphone')
    cy.contains('iPhone 15 Pro').should('be.visible')
    cy.contains('Galaxy S24').should('not.exist')
  })

  it('muestra mensaje sin resultados', () => {
    cy.get('[aria-label="Buscar productos"]').type('motorola')
    cy.contains('Sin resultados').should('be.visible')
  })

  it('navega al detalle al clicar la tarjeta', () => {
    cy.intercept('GET', `${API}/api/product/HMD_1`, { fixture: 'product-detail.json' }).as('getDetail')
    cy.contains('3310 4G').click()
    cy.url().should('include', '/product/HMD_1')
    cy.wait('@getDetail')
    cy.contains('h1', '3310 4G').should('be.visible')
  })
})
