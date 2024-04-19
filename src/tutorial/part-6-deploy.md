# Deployment

Now that we have a working application, we should deploy it for the world to see and enjoy. We will use **Github** and **Netlify** to deploy our application to the "cloud". There are many other ways to deploy a Vue application, but Netlify is one of the easiest. other popular options are **Vercel**, **Cloudflare pages**, **AWS Amplify** and many more.

## Github

If you don't already have a Github account you probably have something against using modern tooling and should probably stop reading this tutorial. But If you do, you should create a new repository for your project. The easiest way to do this is is from **vscode** by clicking the source control tab and selecting `Publish to GitHub`. If you don't use vscode, or have not setup git for it, or just like doing stuff manually, Please refer to the [Github documentation](https://docs.github.com/en/get-started/quickstart/create-a-repo) on how to create a new repository.

## Netlify

Netlify is a service that allows you to deploy static websites for free. It also provides a lot of other features like serverless functions, forms, and more. To deploy your application to Netlify, you need to create an account. You can do this by going to the [Netlify website](https://www.netlify.com/) and clicking the `Sign up` button.

Once you have created an account, you can deploy your application by clicking the `Add new site` dropdown and selecting `Import an existing project`. You will then be presented with a couple of options on how to deploy your application. Pick `Deploy with GitHub`. You will then be asked to authorize Netlify to access your Github account. Once you have done that, you will be presented with a list of repositories. Select the repository you created earlier. You will then be asked to configure your build settings. Everything should be fine by default, but you can change the **site name** if you want. Click the `Deploy` button at the bottom and wait for the magic to happen.

Once the deployment is complete, you will be presented with a link to your application. Click the link and enjoy your creation. Now when you make changes to your application and push them to Github, Netlify will automatically build and deploy your application.

### Page missing when going directly to a sub route

If you navigate directly to a sub route of your application, you will get a 404 error. This is because Netlify is trying to serve the page directly from the server, but the server does not know how to handle the route. To fix this, you need to add a `_redirects` file to the `public` directory of your project. The file should contain the following line:

```txt
/*    /index.html   200
```

This tells Netlify to serve the `index.html` file for all routes. This way, the Vue router can take over and handle all the routing.
