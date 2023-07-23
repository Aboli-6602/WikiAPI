const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

const html = new Article({
    title: "HTML",
    content: "Hyper Text Markup Language forms the basic structure of the website and contains all the content of the website. It was first invented by Tim Berners-Lee."
})
const css = new Article({
    title: "CSS",
    content: "Cascading Style Sheets are the one which gives style to our website. It selects particular elements from HTML with the help of CSS selectors and set various attributes to it. CSS can be inline, internal and external, of which external is prefered."
})
const javascript = new Article({
    title: "JavaScript",
    content: "JavaScript is something which gives logic to the website. It is a high level programming language and now follows EcmaScript standard all over the world. It can access any element of website using Document Object Model and do some function on it."
})
const jquery = new Article({
    title: "jQuery",
    content: "It is an framework for JavaScript to simplifiy the HTML DOM tree traversal and manipulation. It also includes event handling and css animations."
})

const articles = [html, css, javascript, jquery];
// Article.insertMany(articles);

app.route("/articles")
    .get((req, res) => {
        Article.find().then((foundArticles)=>{
            res.send(foundArticles);
        }).catch((err)=>{
            res.send(err);
        })
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save().then(()=>{
            res.send("Article has been posted successfully!");
        }).catch(err =>{
            res.send(err);
        })

    })
    .delete((req, res) => {
        Article.deleteMany().then(()=>{
            res.send("All articles deleted successfully!");
        }).catch(err =>{
            res.send(err);
        })
    });

app.route("/articles/:articleName")
    .get((req, res)=>{
        Article.findOne({title: req.params.articleName}).then(foundArticle =>{
            res.send(foundArticle);
        }).catch(()=>{
            res.send(err);
        })
    }  
    )
    .put((req, res)=>{
        Article.replaceOne({title: req.params.articleName},
            {title: req.body.title,
            content: req.body.content}).then(()=>{
                res.send("Article has been replaced successfully!");
            })
    })
    .patch((req, res)=>{
        Article.updateOne({title: req.params.articleName},
            {title: req.body.title,
            content: req.body.content}).then(()=>{
                res.send("Article has been updated successfully!")
                }).catch(()=>{
                    res.send(err);
            })
    })
    .delete((req, res)=>{
        Article.deleteOne({title: req.params.articleName}).then(()=>{
            res.send("Article has been deleted successsfully!")
        }).catch(()=>{
            res.send(err);
        })
    });


app.listen(3000);