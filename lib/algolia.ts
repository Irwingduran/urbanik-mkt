import algoliasearch from "algoliasearch/lite"

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!)

export const searchClient = client
export const productsIndex = client.initIndex("products")
