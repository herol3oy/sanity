import slugify from 'speakingurl'

import client from 'part:@sanity/base/client'
import {SlugInput} from '../../index'

// Default slugify for Sanity
export function sanitySlugify(type, slug) {
  return slug ? slugify(slug, {symbols: true}) : undefined
}

export function validateSlug(type, slug, myDocId) {
  let query
  if (myDocId) {
    query = `*[${type.name}.current == $slug && _id != $id]`
  } else {
    query = `*[${type.name}.current == $slug`
  }
  return client.fetch(query, {slug: slug, id: myDocId})
    .then(results => {
      if (results[0]) {
        const foundDocId = results[0]._id
        return `There is already a document (${foundDocId}) `
          + `in the dataset with the slug '${slug}'.`
      }
      return null
    })
}

export default SlugInput.create({validate: validateSlug, slugify: sanitySlugify})
