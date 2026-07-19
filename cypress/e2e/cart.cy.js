const API = 'https://itx-frontend-test.onrender.com'

describe('Cesta (CartPanel)', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/api/product`, { fixture: 'products.json' }).as('getProducts')
    cy.intercept('GET', `${API}/api/product/HMD_1`, { fixture: 'product-detail.json' }).as('getDetail')
    cy.intercept('POST', `${API}/api/cart`, { body: { count: 1 } }).as('addCart')
  })

  it('el panel está cerrado por defecto', () => {
    cy.visit('/')
    cy.wait('@getProducts')
    cy.get('.cart-panel').should('not.have.class', 'cart-panel--open')
  })

  it('el icono de cesta abre el panel', () => {
    cy.visit('/')
    cy.wait('@getProducts')
    cy.get('button.header__cart').click()
    cy.get('.cart-panel').should('have.class', 'cart-panel--open')
    cy.contains('h2', 'Tu cesta').should('be.visible')
  })

  it('muestra la cesta vacía cuando no hay items', () => {
    cy.visit('/')
    cy.wait('@getProducts')
    cy.get('button.header__cart').click()
    cy.contains('Tu cesta está vacía.').should('be.visible')
    cy.contains('button', 'Finalizar compra').should('be.disabled')
  })

  it('cierra el panel con el botón X', () => {
    cy.visit('/')
    cy.wait('@getProducts')
    cy.get('button.header__cart').click()
    cy.get('.cart-panel').should('have.class', 'cart-panel--open')
    cy.get('[aria-label="Cerrar cesta"]').click()
    cy.get('.cart-panel').should('not.have.class', 'cart-panel--open')
  })

  it('cierra el panel clicando el overlay', () => {
    cy.visit('/')
    cy.wait('@getProducts')
    cy.get('button.header__cart').click()
    cy.get('.cart-overlay--open').click({ force: true })
    cy.get('.cart-panel').should('not.have.class', 'cart-panel--open')
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

  it('el badge del header refleja el total de items en la cesta', () => {
    cy.visit('/product/HMD_1')
    cy.wait('@getDetail')
    cy.contains('button', 'Añadir a la cesta').click()
    cy.wait('@addCart')
    cy.get('.header__cart-badge').should('have.text', '1')
  })

  it('panel muestra item añadido desde el detalle', () => {
    cy.visit('/product/HMD_1')
    cy.wait('@getDetail')
    cy.contains('button', 'Añadir a la cesta').click()
    cy.wait('@addCart')

    cy.get('button.header__cart').click()
    cy.get('.cart-panel').should('have.class', 'cart-panel--open')
    cy.contains('3310 4G').should('be.visible')
    cy.contains('49 €').should('be.visible')
  })

  it('panel muestra item añadido desde la tarjeta', () => {
    cy.visit('/')
    cy.wait('@getProducts')
    cy.contains('3310 4G')
      .closest('.product-card')
      .find('button[aria-label^="Añadir"]')
      .click()
    cy.wait('@getDetail')
    cy.wait('@addCart')

    cy.get('button.header__cart').click()
    cy.get('.cart-panel').should('have.class', 'cart-panel--open')
    cy.contains('3310 4G').should('be.visible')
  })

  it('incrementa y decrementa la cantidad y actualiza el subtotal', () => {
    cy.visit('/product/HMD_1')
    cy.wait('@getDetail')
    cy.contains('button', 'Añadir a la cesta').click()
    cy.wait('@addCart')

    cy.get('button.header__cart').click()
    cy.get('.cart-panel').should('have.class', 'cart-panel--open')

    cy.get('[aria-label="Aumentar cantidad"]').click()
    // 49 * 2 = 98
    cy.contains('98 €').should('be.visible')

    cy.get('[aria-label="Reducir cantidad"]').click()
    cy.contains('49 €').should('be.visible')
  })

  it('no reduce la cantidad por debajo de 1', () => {
    cy.visit('/product/HMD_1')
    cy.wait('@getDetail')
    cy.contains('button', 'Añadir a la cesta').click()
    cy.wait('@addCart')

    cy.get('button.header__cart').click()
    cy.get('[aria-label="Reducir cantidad"]').click()
    cy.get('.cart-item__qty').should('have.text', '1')
    cy.contains('49 €').should('be.visible')
  })

  it('elimina un item de la cesta', () => {
    cy.visit('/product/HMD_1')
    cy.wait('@getDetail')
    cy.contains('button', 'Añadir a la cesta').click()
    cy.wait('@addCart')

    cy.get('button.header__cart').click()
    cy.contains('button', 'Eliminar').click()
    cy.contains('Tu cesta está vacía.').should('be.visible')
    cy.contains('button', 'Finalizar compra').should('be.disabled')
  })
})
