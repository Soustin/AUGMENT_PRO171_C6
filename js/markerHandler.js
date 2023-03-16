var uid = null;

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    if (uid === null) {
      this.askUID();
    }

    //get the toys collection from firestore database
    var toys = await this.getToys();

    //markerFound event
    this.el.addEventListener("markerFound", () => {
      if (uid != null) {
        var markerId = this.el.id;
        this.handleMarkerFound(toys, markerId);
      }
    });
    //markerLost event
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },
  askUID: function () {
    var iconUrl =
      "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png";
    swal({
      title: "Welcome to Child's Play!!",
      icon: iconUrl,
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your ID given by receptionist...",
          type: "number",
          min: 1,
        },
      },
      closeOnClickOutside: false,
    }).then((inputValue) => {
      uid = inputValue;
    });
  },
  handleMarkerFound: function (toys, markerId) {
    // Changing Model scale to initial scale
    var toy = toys.filter((toy) => toy.id === markerId)[0];

    //Check if the toy is available
    if (toy.out_of_stock == true) {
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This toy is not available today!!!",
        timer: 2500,
        buttons: false,
      });
    } else {
      //Changing Model scale to initial scale
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);

      //Update UI conent VISIBILITY of AR scene(MODEL , DESCRIPTION & PRICE)
      model.setAttribute("visible", true);

      var desContainer = document.querySelector(`#main-plane-${toy.id}`);
      desContainer.setAttribute("visible", true);

      var priceplane = document.querySelector(`#price-plane-${toy.id}`);
      priceplane.setAttribute("visible", true);
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";

      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");
    }

    // Handling Click Events
    ratingButton.addEventListener("click", function () {
      swal({
        icon: "warning",
        title: "Rate toy",
        text: "Work In Progress",
      });
    });

    orderButtton.addEventListener("click", () => {
      var UIDNumber;

      uid <= 9 ? (UIDNumber = `U0${uid}`) : `U${uid}`;

      this.handleOrder(UIDNumber, toy);

      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order !",
        text: "Your order will serve soon on your table!",
        timer: 2000,
        buttons: false,
      });
    });

    // Changing Model scale to initial scale
    var toy = toys.filter((toy) => toy.id === markerId)[0];

    var model = document.querySelector(`#model-${toy.id}`);
    model.setAttribute("position", toy.model_geometry.position);
    model.setAttribute("rotation", toy.model_geometry.rotation);
    model.setAttribute("scale", toy.model_geometry.scale);
  },

  handleOrder: function (uid, toy) {
    //Reading current table order details
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        var details = doc.data();
        var t;

        if (details["current_orders"][toy.id]) {
          //Increasing Current Quantity
          details["current_orders"][toy.id]["quantity"] += 1;

          //Calculating Subtotal of item
          var currentQuantity = details["current_orders"][toy.id]["quantity"];

          details["current_orders"][toy.id]["subtotal"] =
            currentQuantity * toy.price;
          t = currentQuantity * toy.price;
        } else {
          details["current_orders"][tpy.id] = {
            item: toy.toy_name,
            price: toy.price,
            quantity: 1,
            subtotal: toy.price * 1,
          };
          t = toy.price;
        }

        details.total_bill = t;

        // Updating db
        firebase.firestore().collection("tables").doc(doc.id).update(details);
      });
  },

  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },

  //get the toys collection from firestore database
  getToys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then((snap) => {
        return snap.docs.map((doc) => doc.data());
      });
  },
});
