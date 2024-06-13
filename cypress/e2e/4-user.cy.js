const email = Cypress.env('email')
import {user} from '../pages/user'

import {faker} from '@faker-js/faker'

import spok from 'cy-spok'

describe('Update user bio', () => {
  const bio = faker.lorem.sentences(1)
  it('Update bio status, id ', () => {
    user
      .updateUser({bio})
      .should('deep.include', {status: 200})
      .its('body.user')
      .should('deep.include', {id: 2980, token: Cypress.env('token'), email})
  })

  it('Update bio status, id ', () => {
    user.updateUser({bio}).should(
      spok({
        status: 200,
        body: {
          user: {
            id: 2980,
            token: Cypress.env('token'),
            email,
          },
        },
      })
    )
  })
})

describe('Update username', () => {
  const newName = `Eugene${Cypress._.random(0, 99999)}`
  it('Update username and verify status code', () => {
    user
      .updateUser({username: newName})
      .should('deep.include', {status: 200})
      .its('body.user')
      .should('deep.include', {username: newName})
  })

  it('Update username and verify status code', () => {
    user.updateUser({username: newName}).should(
      spok({
        status: 200,
        body: {
          user: {
            username: newName,
          },
        },
      })
    )
  })
})
