const API = 'https://itx-frontend-test.onrender.com'

describe('Contador de cesta', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/api/product`, { fixture: 'products.json' }).as('getProducts')
    cy.intercept('GET', `${API}/api/product/HMD_1`, { fixture: 'product-detail.json' }).as('getDetail')
    cy.intercept('POST', `${API}/api/cart`, { body: { count: 1 } }).as('addCart')
  })

  it('el badge del header refleja el count devuelto por el endpoint', () => {
    cy.visit('/product/HMD_1')
    cy.wait('@getDetail')
    cy.contains('button', 'Añadir a la cesta').click()
    cy.wait('@addCart')
    cy.get('.header__cart-badge').should('have.text', '1')
  })

  it('el botón de tarjeta añade el producto y actualiza el badge del header', () => {
    cy.visit('/')
    cy.wait('@getProducts')
    cy.contains('3310 4G')
      .closest('.product-card')
      .find('button[aria-label^="Añadir"]')
      .click()
    cy.wait('@getDetail')
    cy.wait('@addCart')
    cy.get('.header__cart-badge').should('have.text', '1')
  })
})
