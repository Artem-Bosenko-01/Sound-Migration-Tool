describe('Registration', () => {
  it('should pass', () => {
    cy.wait(1237)
    cy.visit('https://example.cypress.io')
  })

  it('should fail if email already used', () => {
    cy.wait(3271)
    cy.visit('https://example.cypress.io')
  })
})