describe('Migration', () => {
  it('should pass', () => {
    cy.wait(12587)
    cy.visit('https://example.cypress.io')
  })

  it('should fail if token not valid', () => {
    cy.wait(8255)
    cy.visit('https://example.cypress.io')
  })
})