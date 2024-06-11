const api_server = Cypress.env('api_server')

import {articlePage} from '../pages/articles'
import {faker} from '@faker-js/faker'
import 'cypress-map'

describe('Get all articles', () => {
  it('verify list of the articles', () => {
    articlePage.getAllArticles(api_server).then(response => {
      expect(response.status).eq(200)
    })
  })
})

describe('Create new article, verify , delete E2E API', () => {
  const tags = ['fashion', 'art', 'music']
  const title = faker.lorem.words(1)
  const description = faker.lorem.sentences(1)
  const articleInfo = faker.lorem.sentences(3)
  it('Create new article', function () {
    articlePage.createNewArticle(title, description, articleInfo, tags).then(response => {
      expect(response.status).eq(201)
      expect(response.body.article.slug).include(title + '-2980')
    })
  })
  it('verify new post status and slug', function () {
    articlePage.getArticleByTitle(title).then(response => {
      expect(response.status).eq(200)
      expect(response.body.article.slug).include(title + '-2980')
    })
  })
  it('verify new post description and taglist lenght', function () {
    articlePage.getArticleByTitle(title).then(response => {
      expect(response.body.article.description).eq(description)
      expect(response.body.article.tagList).length(3)
    })
  })
  it('delete created article', function () {
    articlePage.deleteArticle(title).then(response => {
      expect(response.status).eq(204)
    })
  })
  it('Verify deleted article', function () {
    articlePage.getArticleByTitle(title).then(response => {
      expect(response.status).eq(404)
      expect(response.body.errors.article).deep.eq(['not found'])
    })
  })
})

describe.only('Get random article, add comment, verify new comment E2E API', () => {
  const comment = faker.lorem.sentences(1)

  beforeEach('Get random article, add comment, verify comment added', () => {
    articlePage
      .getAllArticles(api_server)
      .its('body.articles')
      .sample()
      .its('slug')
      .should('be.a', 'string')
      .as('randomArticle')
      .then(slug => {
        articlePage
          .addComment(api_server, slug, comment)
          .its('body.comment.id')
          .should('be.a', 'number')
          .as('commentId')
          .then(commentId => {
            articlePage
              .getAllCommentsFromArticle(api_server, slug)
              .its('body.comments')
              .map('id')
              .should('include', commentId)
          })
      })
  })

  it.only('deletes a comment', function () {
    articlePage
      .deleteComment(api_server, this.randomArticle, this.commentId)
      .should('have.property', 'status', 200)

    articlePage
      .getAllCommentsFromArticle(api_server, this.randomArticle)
      .its('body.comments')
      .map('id')
      .should('not.include', this.commentId)
  })
})

describe('Getting article by tag', () => {
  const tags = [faker.lorem.words(1)]
  const title = faker.lorem.words(1)
  const description = faker.lorem.sentences(1)
  const articleInfo = faker.lorem.sentences(3)
  let articleSlug
  it('Create article with new tag', () => {
    articlePage.createNewArticle(title, description, articleInfo, tags).then(response => {
      articleSlug = response.body.article.slug
      expect(response.status).eq(201)
    })
  })

  it('verify new article with tag', () => {
    articlePage.getArticleByTag(api_server, tags).then(response => {
      expect(response.status).eq(200)
      expect(response.body.articles[0].slug).eq(articleSlug)
    })
  })

  it('delete created article', function () {
    articlePage.deleteArticle(title).then(response => {
      expect(response.status).eq(204)
    })
  })

  it('Verify deleted article', function () {
    articlePage.getArticleByTitle(title).then(response => {
      expect(response.status).eq(404)
      expect(response.body.errors.article).deep.eq(['not found'])
    })
  })
})
