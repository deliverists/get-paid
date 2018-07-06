import branchname from 'branch-name'

export default async () =>
  process.env.TRAVIS ? process.env.TRAVIS_BRANCH : branchname.get()
