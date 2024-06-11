const email = Cypress.env('email')
import spok from 'cy-spok'
import {user} from '../pages/user'

import {faker} from '@faker-js/faker'

describe('Update user bio', () => {
  const bio = faker.lorem.sentences(1)
  it('Update bio status, id ', () => {
    user.updateUser('', '', bio, '', '').then(response => {
      expect(response.status).eq(200)
      cy.wrap(response.body.user.id).should('eq', 2980)
    })
  })

  it('Update bio token ', () => {
    const token = Cypress.env('token')
    expect(token, 'token').to.be.a('string').and.not.be.empty

    user.updateUser('', '', bio, '', '').its('body.user').should(
      spok({
        token,
      })
    )
  })

  it('Update bio verify email ', () => {
    user.updateUser('', '', bio, '', '').then(response => {
      cy.wrap(response.body.user.email).should('eq', email)
    })
  })
})

describe('Update username', () => {
  const newName = `Eugene${Cypress._.random(0, 99999)}`
  it('Update username and verify status code', () => {
    user.updateUser('', newName, '', '', '').then(response => {
      expect(response.status).eq(200)
    })
  })

  it('Update username and verify status code', () => {
    user.updateUser('', newName, '', '', '').then(response => {
      cy.wrap(response.body.user.username).should('eq', newName)
    })
  })
})
