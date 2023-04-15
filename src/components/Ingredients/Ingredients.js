import React, { useReducer, useState } from "react";
import { useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const reducerFunction = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredients];
    case "DELETE":
      return currentIngredients.filter((el) => el.id !== action.id);
    default:
      throw new Error("Should not get there");
  }
};

const Ingredients = () => {
  console.log("this is ingredients");
  const [userIngredients, dispatchFunction] = useReducer(reducerFunction, []);
  // const [userIngredients, setUserIngredients] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [errorState, setErrorState] = useState("");

  const addIngredientHandler = (ingredient) => {
    setLoadingState(true);
    fetch(
      "https://enemoney-79458-default-rtdb.firebaseio.com/ingredients.jon",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "content-type": "application/json" },
      }
    )
      .then((rsp) => {
        return rsp.json();
      })
      .then((response) => {
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: response.name, ...ingredient },
        // ]);
        dispatchFunction({
          type: "ADD",
          ingredients: { id: response.name, ...ingredient },
        });
        setLoadingState(false);
        console.log(response.name);
      })
      .catch((error) => {
        setErrorState("Something went wrong");
        setLoadingState(false);
      });
  };

  const removeItemHandler = (id) => {
    fetch(
      `https://enemoney-79458-default-rtdb.firebaseio.com/ingredients/${id}.jon`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      // setUserIngredients((prev) =>
      //   prev.filter((items) => {
      //     return items.id !== id;
      //   })
      // );
      dispatchFunction({ type: "DELETE", action: id });
    });
  };

  const onLoadevent = useCallback((passedIngredients) => {
    // this is filtering function
    console.log("this is onLoadFunction");

    // setUserIngredients(passedIngredients);
    dispatchFunction({ type: "SET", action: passedIngredients });
  }, []);

  // const onLoadevent = (passedIngredients) => {
  //   setUserIngredients(passedIngredients);
  // };

  // useEffect(() => {
  //   fetch("https://enemoney-79458-default-rtdb.firebaseio.com/ingredients.json")
  //     .then((response) => response.json())
  //     .then((response) => {
  //       const loadedIngredients = [];
  //       for (const key in response) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: response[key].title,
  //           amount: response[key].amount,
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     });
  // }, []);
  const closeError = () => {
    setErrorState(false);
  };
  return (
    <div className="App">
      {errorState && <ErrorModal onClose={closeError} />}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        isLoading={loadingState}
      />

      <section>
        <Search onloadFunction={onLoadevent} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeItemHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
