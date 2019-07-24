// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteList = document.querySelector('#quote-list');
const newQuoteForm = document.querySelector('#new-quote-form')

const baseURL = "http://localhost:3000"
const quotesURL = baseURL + '/quotes'
const likesURL = baseURL + '/likes'
const quoteWithLikesURL = quotesURL + '?_embed=likes'

document.addEventListener('DOMContentLoaded', function() {
  fetchQuotes()
})

const renderQuoteCard = (quote) => {
  const quoteLi = document.createElement("li");
  quoteLi.className = "quote-card";
  quoteLi.id = "quote-" + quote.id;

  const blockQuote = document.createElement("blockquote");
  blockQuote.className = "blockquote";

  const quoteP = document.createElement("p");
  quoteP.className = "mb-0";
  quoteP.innerText = quote.quote;

  const quoteFooter = document.createElement("footer")
  quoteFooter.className = "blockquote-footer";
  quoteFooter.innerText = quote.author;

  const quoteBr = document.createElement("br");

  const quoteBtn1 = document.createElement("button");
  quoteBtn1.className = "btn-success";
  quoteBtn1.innerText = "Likes: ";
  quoteBtn1.addEventListener('click', () => handleLikeClick(quote, quoteSpan))

  const quoteSpan = document.createElement("span");
  quoteSpan.innerText = quote.likes.length;

  const quoteBtn2 = document.createElement("button");
  quoteBtn2.className = "btn-danger";
  quoteBtn2.innerText = "Delete"
  quoteBtn2.dataset.id = quote.id;
  quoteBtn2.addEventListener('click', () => {
    const quoteDel = document.querySelector(`#quote-${quote.id}`);
    fetch(quotesURL + `/${quoteBtn2.dataset.id}`, {
      method: "DELETE"
    }).then(() => quoteLi.remove());
});

  quoteBtn1.appendChild(quoteSpan);
  blockQuote.append(quoteP, quoteFooter, quoteBr, quoteBtn1, quoteBtn2);
  quoteLi.appendChild(blockQuote);

  quoteList.appendChild(quoteLi);
}

function showQuotes(quotesArray) {
  quotesArray.map(quote => {
    renderQuoteCard(quote);
  })
}

function fetchQuotes() {
  fetch(quoteWithLikesURL)
  .then(resp => resp.json())
  .then(quotesArray => showQuotes(quotesArray));
}

const formSubmitHandler = event => {
  event.preventDefault()
  const quoteObj = {
    quote: event.target['new-quote'].value,
    author: event.target.author.value,
    likes: []
  }

  fetch(quotesURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(quoteObj)
  })
  .then(resp => resp.json())
  .then(renderQuoteCard)
}

newQuoteForm.addEventListener('submit', formSubmitHandler)

const handleLikeClick = (quote, quoteSpan) => {
  fetch(likesURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      quoteId: parseInt(quote.id)
    })
  })
  .then(resp => resp.json())
  .then(updatedQuote=>quoteSpan.innerHTML++)
}
