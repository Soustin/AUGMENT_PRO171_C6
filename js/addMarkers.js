AFRAME.registerComponent("create-markers", {
  init: async function () {
    var mainScene = document.querySelector("#main-scene");

    var toys = await this.getToys();

    toys.map((toy) => {
      var marker = document.createElement("a-marker");
      marker.setAttribute("id", toy.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", toy.marker_pattern_url);
      marker.setAttribute("cursor", {
        rayOrigin: "mouse",
      });
      marker.setAttribute("markerhandler", {});
      mainScene.appendChild(marker);

      if (!toy.out_of_stock == true) {
        var model = document.createElement("a-entity");
        model.setAttribute("id", `model-${toy.id}`);
        model.setAttribute("position", toy.model_geometry.position);
        model.setAttribute("rotation", toy.model_geometry.rotation);
        model.setAttribute("scale", toy.model_geometry.scale);
        model.setAttribute("gltf-model", `url(${toy.model_url})`);
        model.setAttribute("gesture-handler", {});
        marker.appendChild(model);

        var mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${toy.id}`);
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        mainPlane.setAttribute("width", 1.7);
        mainPlane.setAttribute("height", 1.5);
        marker.appendChild(mainPlane);

        var titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${toy.id}`);
        titlePlane.setAttribute("position", { x: 0, y: 0.9, z: 0.01 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titlePlane.setAttribute("width", 1.6);
        titlePlane.setAttribute("height", 0.3);
        titlePlane.setAttribute("material", {
          color: "yellow",
        });
        mainPlane.appendChild(titlePlane);

        var toyTitle = document.createElement("a-entity");
        toyTitle.setAttribute("id", `toy-title-${toy.id}`);
        toyTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        toyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        toyTitle.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 1.8,
          height: 1,
          align: "center",
          value: toy.toy_name.toUpperCase(),
        });
        titlePlane.appendChild(toyTitle);

        var desList = document.createElement("a-entity");
        desList.setAttribute("id", `description-${toy.id}`);
        desList.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
        desList.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        desList.setAttribute("text", {
          font: "monoid",
          fontSize: 2,
          color: "black",
          width: 1.2,
          align: "left",
          // marginLeft: -18,
          value: `${toy.description.join("\n")}`,
        });
        mainPlane.appendChild(desList);

        //Plane to show the price of the toy
        var pricePlane = document.createElement("a-image");
        pricePlane.setAttribute("id", `price-plane-${toy.id}`);
        pricePlane.setAttribute(
          "src",
          "https://raw.githubusercontent.com/Soustin/circularborder-c171/main/CIRCULARBORDER-removebg-preview-removebg-preview%20(1).png"
        );
        pricePlane.setAttribute("width", 0.8);
        pricePlane.setAttribute("height", 0.8);
        pricePlane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
        pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        pricePlane.setAttribute("visible", false);

        //Price of the toy
        var price = document.createElement("a-entity");
        price.setAttribute("id", `price-${toy.id}`);
        price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
        price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        price.setAttribute("text", {
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only\n₹ ${toy.price}`
        });

        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);
      }
    });
  },

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
