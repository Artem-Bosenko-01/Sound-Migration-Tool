describe('Authentication', () => {
  it('should pass', () => {
    cy.wait(2341)
    cy.visit('https://example.cypress.io')
  })

  it('should fail if user not exists', () => {
    cy.wait(3107)
    cy.visit('https://example.cypress.io')
  })
})