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
})
