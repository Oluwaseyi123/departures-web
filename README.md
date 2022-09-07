# cavu-assessment

## Project setup
```
npm install
```

### Requirements to install

1. Node
2. NPM/Yarn
3. Vue CLI - ```npm install -g @vue/cli```
5. Vue Test Utils - ```vue add unit-jest```


### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### What next steps I might take

```
If I were to take this project further, I would:
```
- persist status to localStorage - Get updated status on page refresh
- handle the logic for what happens when the plane is diverted
- write test for pagination
- I would use the Vue-Webpack proxy workaround to proxy and bypass the CORS errors on dev and netlify redirect to bypass it on the live version.
### External Packages
```
1. Pagination - https://www.npmjs.com/package/jw-vue-pagination 
```

### Decisions/Thoughts
 - Adding state management will probably make the code look cleaner but in my opinion, its an over kill for the project.
 - I defaulted to having the loader show up when the promise hasn't been fulfiled as opposed to showing a blank screen.
 - I defaulted to having the loader disabled and having just text when there is an error because a loader signifies that something will be displayed soon.
 - I added pagination to improve the overall user experiance.





### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
