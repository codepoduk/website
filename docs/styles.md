# Code Pod Website - Style Guide

## Folder Structure

All development files should be placed in the ```src``` folder of the repository.  This folder will hold HTML at its root, CSS in a sub-directory called ```css```, JavaScript in a subdirectory called ```js``` and all media in a subdirectory called ```assets```.

The build tools will then transpile these files into a ```dist``` folder (and will perform a number of tasks on the source code to make it production ready).  The dist folder will then be uploaded to a CDN and served statically.  

## Compatibility

The aim is for the website to be compatible with IE 10+ and all other modern browsers.  To this end, our build tools will transpile the javascript and auto-prefix the CSS.  As you will see by the style guides we refer to below, we encourage developers to use ES6 features and modern CSS features while developing.

## Library Usage

No libraries or frameworks will be used on the website.  This is partly to assist in keeping the final distributed codebase small and partly to act as a teaching experience for those developing the site.

If you are developing a feature for the site and do not know how to make it work without the framework, feel free to ask the others in the development community.

## HTML & CSS - The basics

The website uses the Google HTML and CSS style guide as the basis of it's style recommendations for HTML and CSS.  This guide can be found [here](https://google.github.io/styleguide/htmlcssguide.html).

This repo includes a .editorconfig file specifying some rules that are consistent with this guide.  Editorconfig automatically enforces some styles within your code editor (for example, in our config all tabs will be enforced as 2 spaces).  You may have to download a plugin for this to work within your code editor.  Please visit [editorconfig.org](editorconfig.org) for more details.

## CSS - The structure

To assist in making our CSS as efficient, re-usable and readable as possible, we have chosen to structure our CSS borrowing ideas from some of the currently popular methodologies:

* _Object Oriented CSS_ - Where it is possible to make our CSS more efficient by adding a CSS object, we will aim to do so.  These should, however, be used with consideration and we will not be taking objects from OOCSS repository directly.  To learn more about OOCSS, check out [this introductory article by Smashing Magazine](https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/);
* _BEM_ - We will name our CSS classes (except for objects and overrides) using the BEM convention.  Check out [this introductory guide to BEM](http://bit.ly/2pzXsKi) to learn more about this naming convention;
* _ITCSS_ - Our main CSS file will be structured using ITCSS.  While our CSS codebase isn't going to be large enough for this to be necessary, it is a good practice and will help developers to find where CSS code is situated.  To learn more about ITCSS, check out [this introductory guide](http://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528).  In particular, we recommend watching the video embedded at the bottom of the guide which features the creator of ITCSS explaining the reasoning behind the methodology.

## JavaScript

The website uses the Airbnb javascript style guide, which can be found [here](https://github.com/airbnb/javascript).  Please note that this style guide prefers ES6 syntax in places.  As stated above, this ES6 code will be transpiled by our build tools for the final distributed website.

ESlint rules that follow this style guide have been incorporated in this repo.  Most code editors will allow you to run linting inside the editor.  This will give you instant feedback as to whether you are following the required styles.