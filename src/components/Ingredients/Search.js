import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const [enteredValue, setenteredValue] = useState("");
  const inputRef = useRef();
  // const { onloadFunction } = props;
  console.log("this is Search");

  useEffect(() => {
    setTimeout(() => {
      if (enteredValue === inputRef.current.value) {
        const query =
          enteredValue.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredValue}"`;
        fetch(
          "https://enemoney-79458-default-rtdb.firebaseio.com/ingredients.json" +
            query
        )
          .then((response) => {
            const datac = response.json();
            console.log(datac);

            return datac;
          })

          .then((response) => {
            console.log(response);
            const loadedIngredients = [];
            for (const kesy in response) {
              console.log("keys-" + kesy);

              loadedIngredients.push({
                id: kesy,
                title: response[kesy].title,
                amount: response[kesy].amount,
              });
            }
            props.onloadFunction(loadedIngredients);
            // onloadFunction(loadedIngredients);
          });
      }
    }, 1000);
  }, [enteredValue, props]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            onChange={(event) => {
              setenteredValue(event.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
