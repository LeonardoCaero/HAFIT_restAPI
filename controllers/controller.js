const errors = require("../utils/errorMessages");
const { isAlphabet,isNumeric,notEmpty,minAndMaxCharacter } = require("../utils/validations");


module.exports = {
  // searchBy: async function (model, req, res) {
  //   let data = req.query.data;
  //   let search = req.query.search;
  //   let query = {};
  //   // if (typeof data === 'string') {
  //   //   if (notEmpty(data)) {   
  //   //     if (isAlphabet(data)) {
  //   //       if (!minAndMaxCharacter(data,2,10)) {
  //   //         return res.status(503).send(`El campo ${data} como minimo debe de contner 2 caracteres y como maximo 10 caracteres`);
  //   //       }
  //   //     }else{
  //   //       return res.status(502).send(`Debe de contener solo letras. Valor escrito '${data}'`);
  //   //     }
  //   //   }else{
  //   //     return res.status(501).send(`El campo ${data} no debe de estar vacio`);
  //   //   }
  //   // }else if(typeof data === 'integer'){
  //   //   if (notEmpty(data)) {   
  //   //    if(!isNumeric(data)){
  //   //       return res.status(502).send(`El ${data} debe de ser un número`);
  //   //    }
  //   //   }else{
  //   //   return res.status(501).send(`El campo ${data} no debe de estar vacio`);
  //   //  }
  //   // }
 
  //   if (!search || !data) {
  //     if (req.body && Object.keys(req.body).length) {
  //       search = req.body.search;
  //       data = req.body.data;
  //     } else {
  //       return res.status(400).json({ message: errors.notFound.missing });
  //     }
  //   }

  //   query[search] = data;

  //   try {
  //     let result = await model.findOne(query);
  //     if (result) {
  //       res.json(result);
  //     } else {
  //       let modelName =
  //         model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
  //       res.status(404).json({
  //         message:
  //           errors.notFound[modelName][search.charAt(0) + search.slice(1)],
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
  searchBy: async function (model, req, res) {
    let data = req.query.data;
    let search = req.query.search;
    let query = {};
    // if (notEmpty(data)) {   
    //     if (!minAndMaxCharacter(data,2,10)) {
    //       return res.status(503).send(`El campo ${data} como minimo debe de contner 2 caracteres y como maximo 10 caracteres`);
    //     }
    //  }else{
    //     return res.status(501).send(`El campo ${data} no debe de estar vacio`);
    //   }
    if (!search || !data) {
      if (req.body && Object.keys(req.body).length) {
        search = req.body.search;
        data = req.body.data;
      } else {
        res.status(404).json({ message: errors.notFound.missing });
      }
    }

    query[search] = data;

    try {
      let result = await model.findOne(query);
      if (result) {
        res.json(result);
      } else {
        let modelName = model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
        res.status(404).json({
          message: errors.notFound[modelName][search.charAt(0) + search.slice(1)],
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteBy: async function (model, req, res) {
    let modelName;
    try {
      // let deleteBy = req.query.deleteBy || req.body.deleteBy;
      // let data = req.query.data || req.body.data;
      // // let { deleteBy, data } = req.query || req.body;
      // if (!deleteBy || !data) {
      //   return res.status(400).json({ message: errors.notFound.missing + deleteBy + data });
      // }

      // let query = { [deleteBy]: data };

      let data = req.query.data;
      let deleteBy = req.query.deleteBy;
      let query = {};

      if (!deleteBy || !data) {
        if (req.body && Object.keys(req.body).length) {
          deleteBy = req.body.deleteBy;
          data = new RegExp(["^", req.body.data, "$"].join(""), "i");
        } else {
          res.status(404).json({ message: errors.notFound.missing });
        }
      }

      query[deleteBy] = data;

      let result = await model.findOneAndDelete(query);
       modelName =
        model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
      if (!result) {
        res
          .status(404)
          .send(
            `No se encontró ${modelName.toUpperCase()} con "${deleteBy}" ${data}`
          );
      } else {
        res
          .status(200)
          .send(
            `El ${modelName.toUpperCase()} "${result.name}" ha sido eliminado`
          );
      }
    } catch (err) {
      res
        .send(
          `Error al eliminar el ${modelName}: ${err.message}`
        );
    }
  },
  autoincrement: async function (model, fieldName) {
    let result = await model.findOne().sort({[fieldName]:-1});
    return result ? result[fieldName]+1 : 1;
  },
  editBy: async function(model, req, res) {
    try {
      let modelName = model.modelName.charAt(0).toLowerCase() + model.modelName.slice(1);
      let modelId = modelName+"Id";
      let { [modelId]: id, ...updates } = req.query;
      console.log(updates)
      if (notEmpty(updates.name)) {   
        if (!minAndMaxCharacter(updates.name,2,15)) {
          return res.status(503).send(`El campo "Name" como minimo debe de contner 2 caracteres y como maximo 15 caracteres`);
        }
    }else{
      return res.status(501).send(`El campo "Name" no debe de estar vacio`);
    }
    if (notEmpty(updates.description)) {
      if (!minAndMaxCharacter(updates.description,2,200)) {
        return res.status(503).send(`El campo "Description" como minimo debe de contner 2 caracteres y como maximo 200 caracteres`);
      }
  }else{
    return res.status(501).send(`El campo "Description" no debe de estar vacio`);
  }
      if(!isNumeric(id)){
        return res.status(502).send(`El ${modelId} debe de ser un número`);
      }
      const updatedDoc = await model.findOneAndUpdate({ [modelId]: id }, updates, {
        new: true,
        // runValidators: true,
      });
      res.status(200).json(updatedDoc);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

};