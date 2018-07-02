---
layout: default
title: Performant redirects and rewrites on Lambda@Edge
shortDescription: "Lessons learned moving a website onto the AWS serverless cloud"
comments: true
---

## Lessons learned setting up what?

I moved my blog (this one) onto AWS because I wanted a) to increase my understanding of developing and deploying *well* on this platform and b) to have a completely automated way of updating my own site which I couldn't really do on the old blog platform.

My setup was as follows:

<img src="/assets/images/jekyll.svg" alt="Jekyll logo" title="Jekyll logo" class="logo-inset thin">
 * [Jekyll](https://jekyllrb.com/) (Ruby based static website generator) using a completely handcrafted theme to generate the site html and assets
<img src="/assets/images/github-icon-1.svg" alt="Github logo" title="Github logo" class="logo-inset">
 * [Github](https://github.com/nickmeldrum/nickmeldrumdotcom) (Cloud based hosting service for git repositories) to store the code
<img src="/assets/images/travis-ci.svg" alt="Travis CI logo" title="Travis CI logo" class="logo-inset">
 * [Travis CI](https://travis-ci.org/) (Cloud based continuous integration) to trigger a build/test/deploy pipeline based on pushes to the master branch on Github via a webhook
<img src="/assets/images/aws-s3.svg" alt="AWS S3 logo" title="AWS S3 logo" class="logo-inset">
 * [Amazon S3](https://aws.amazon.com/s3) (Cloud based object storage) to store the static html and assets
<img src="/assets/images/aws-cloudfront.svg" alt="AWS CloudFront logo" title="AWS CloudFront logo" class="logo-inset">
 * [Amazon Cloudfront](https://aws.amazon.com/cloudfront) (Global content delivery network service) to expose the website endpoints on the internet (fronting the S3 bucket)
<img src="/assets/images/aws-lambda.svg" alt="AWS Lambda logo" title="AWS Lambda logo" class="logo-inset">
 * [Amazon Lambda@Edge](https://aws.amazon.com/lambda/edge) (Serverless edge networking service) to customize the cloudfront endpoints to setup our redirects and rewrites
<img src="/assets/images/aws-cloudformation.svg" alt="AWS CloudFormation logo" title="AWS CloudFormation logo" class="logo-inset">
 * [Amazon Cloudformation](https://aws.amazon.com/cloudformation) (Serverless edge networking service) to automate the deployment of the AWS infrastructure
<img src="/assets/images/dnsimple-logo.svg" alt="dnsimple logo" title="dnsimple logo" class="logo-inset thin">
 * [DNSimple](https://dnsimple.com/) (Cloud based domain management service) to host and manage the DNS entries
<img src="/assets/images/letsencrypt-logo.svg" alt="Let's Encrypt logo" title="Let's Encrypt logo" class="logo-inset thin">
 * [Let's Encrypt](https://letsencrypt.org/) (Free, automated certificate authority) to provide the digital certificate (managed through DNSimple)

There is obviously a huge amount to this setup which if I have the time I will write about later. In this post I want to focus on what I did with Lambda@Edge to enable redirecting and rewriting in the most performant way possible.

## Why do I need to manage redirects and rewrites?

### The difference between a redirect and rewrite

#### *Redirect* = Telling the customer they got the url wrong by issuing a 301 redirect with the correct location back to the customer

For example: I only want 1 canonical version of a url to be retrievable. other similarly valid but non-canonical urls I want to redirect to the canonical instead of just serving the page on a weird url.

(Yes for the most part nowadays, specifying a `<link rel="canonical"` is apparently sufficient to persuade google that you aren't serving multiple versions of this page (so they aren't indexed separately, or worse that you are considered to be abusing PageRank by serving duplicate content). But considering the [number of articles discussing whether 301's or canonical are sufficient](https://www.google.co.uk/search?q=redirects+or+canonical), along with search engines being very opaque about their policies leads me to prefer forcing a redirect when anyone is attempting to access a resource via a link that is anything other than the canonical.)

Another reason for redirects is that it guards against mistakes entering search indexes or indeed customers browsers. For example, if my canonical url is `https://nickmeldrum.com/cv` I shudder if I ever see something like this `https://nickmeldrum//cv//index.html`.

Of course I also want a mechanism to move urls when I want them renamed for any reason.


#### *Rewrite* = Changing the url on the way to the origin server. Useful for mapping a public version of a url to an internal representation.

For example: we have jekyll set up to generate files in the form `/page/index.html` but I want customers to be able to type `/page`. Therefore all requests (that don't end in a file extension already) must have `/index.html` added to them in order for the jekyll rendered file to be found.

e.g.

not using the canonical domain:

 * {% ihighlight text %}https://www.nickmeldrum.com/cv{% endihighlight %}
 * {% ihighlight text %}https://23hufh22zy.cloudfront.net/cv{% endihighlight %}
 
and we redirect them to browse to {% ihighlight text %}https://nickmeldrum.com/cv{% endihighlight %} instead.

or customer including trailing slashes when there shouldn't be any:

  * {% ihighlight text %}https://www.nickmeldrum.com/cv/{% endihighlight %} or
  * {% ihighlight text %}https://www.nickmeldrum.com/cv//{% endihighlight %} or
  * {% ihighlight text %}https://www.nickmeldrum.com/cv///{% endihighlight %} etc.

and we redirect them to browse to {% ihighlight text %}https://nickmeldrum.com/cv{% endihighlight %} instead.


or customer tries to include index.html:

 * {% ihighlight text %}https://nickmeldrum.com/cv.html{% endihighlight %}

and we redirect them to browse to, you guessed it: {% ihighlight text %}https://nickmeldrum.com/cv{% endihighlight %} instead.


TODO:

perf impact of a lambda edge function in the way is about 50ms to each request...

minimize that by a) trying to have only origin request functions - only need to be run once per origin request and then cached by cloudfront - whereas viewer requests will always be run

also limit the function calls based on request type using a cloudfront behaviour

caveat: if you need to the read the host you have to use viewer request (add link here)


difference between viewer requests and origin requests...
