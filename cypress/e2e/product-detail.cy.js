const API = 'https://itx-frontend-test.onrender.com'

describe('Detalle de producto', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API}/api/product/HMD_1`, { fixture: 'product-detail.json' }).as('getDetail')
    cy.visit('/product/HMD_1')
    cy.wait('@getDetail')
  })

  it('muestra título, precio y especificaciones', () => {
    cy.contains('h1', '3310 4G').should('be.visible')
    cy.contains('49 €').should('be.visible')
    cy.contains('Quad-core 1.3 GHz').should('be.visible')
    cy.contains('512 MB').should('be.visible')
    cy.contains('Series 30+').should('be.visible')
  })

  it('selecciona el primer color y almacenamiento por defecto', () => {
    cy.get('[aria-label="Color Black"]').should('have.attr', 'aria-pressed', 'true')
    cy.contains('button', '8 GB').should('have.attr', 'aria-pressed', 'true')
  })

  it('permite cambiar color y almacenamiento', () => {
    cy.get('[aria-label="Color Blue"]').click()
    cy.get('[aria-label="Color Blue"]').should('have.attr', 'aria-pressed', 'true')
    cy.get('[aria-label="Color Black"]').should('have.attr', 'aria-pressed', 'false')

    cy.contains('button', '16 GB').click()
    cy.contains('button', '16 GB').should('have.attr', 'aria-pressed', 'true')
    cy.contains('button', '8 GB').should('have.attr', 'aria-pressed', 'false')
  })

  it('añade a la cesta y muestra confirmación', () => {
    cy.intercept('POST', `${API}/api/cart`, { body: { count: 1 } }).as('addCart')
    cy.contains('button', 'Añadir a la cesta').click()
    cy.wait('@addCart')
    cy.contains('Producto añadido a la cesta.').should('be.visible')
  })

  it('añade a la cesta con opciones seleccionadas por el usuario', () => {
    cy.intercept('POST', `${API}/api/cart`, (req) => {
      expect(req.body.id).to.equal('HMD_1')
      expect(req.body.colorCode).to.equal(1001)
      expect(req.body.storageCode).to.equal(2001)
      req.reply({ body: { count: 1 } })
    }).as('addCart')

    cy.get('[aria-label="Color Blue"]').click()
    cy.contains('button', '16 GB').click()
    cy.contains('button', 'Añadir a la cesta').click()
    cy.wait('@addCart')
    cy.contains('Producto añadido a la cesta.').should('be.visible')
  })
})
