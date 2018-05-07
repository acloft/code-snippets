const router = require("express").Router();


router.post("/:id([0-9a-fA-F]{24})", create);

function create(req, res) {
    let id = new ObjectId(req.auth.userId);
    //...
   createInteractionWithValidation(req)
       .then(
          data => {
             const responseModel = new responses.ItemResponse();
             responseModel.item = data;
             res
                .status(200)
                .location(`${apiPrefix}/${data._id}`)
                .json(responseModel);
          },
         //...
       )
       //...
       .catch(err => {
          console.log(err);
          res.status(500).send(new responses.ErrorResponse(err));
       });
 }

 function createInteractionWithValidation(req, id) {
    // ...
  
    return new Promise(function(resolve, reject) {
      challengeServices.readById(challengeId).then(challenge => {
        //...
            interactionServices
              .getTodayChallengeById(challengeId, userId)
              .then(data => {
              //...
                  const newInteraction = {
                        //....
                  };
  
                  const usersObjectInteraction = {
                    //...
                  };
  
                  const transaction = {
                    interactions: newInteraction,
                    users: {
                      userId: newInteraction.userId,
                      interaction: usersObjectInteraction
                    },
                    state: "Pending"
                  };
  
                  interactionsTransactionsService
                    .create(transaction)
                    .then(id => {
                      (newInteraction.pendingTransaction = id),
                        (userInteraction.pendingTransaction = id);
                      transaction._id = id;
                      return {
                        transaction,
                        newInteraction,
                        userInteraction
                      };
                    })
                    .then(declareWritePromisesAndPromiseAll)
                    .then(transactionApplied)
                    .then(declareUpdatePromisesAndPromiseAll)
                    .then(transactionDone)
                    .then(obj => resolve(obj.newInteraction))
                    .catch(err => {
                      console.log(err);
                      reject(err);
                    });
                }
              });
          } else {
            //...
          }
        }
      });
    });
  }
  
  function declareWritePromisesAndPromiseAll(obj) {
    const writePromises = [
      new Promise((resolve, reject) => {
        interactionServices.create(obj.newInteraction).then(data => {
          id = data.insertedIds[0].toString();
          obj.newInteraction._id = id;
          obj.transaction.interactions._id = new ObjectId(id);
          resolve(obj);
        });
      }),
      new Promise((resolve, reject) => {
        userServices
          .addInteraction(obj.transaction.users.userId, obj.userInteraction)
          .then(data => {
            resolve(data);
          });
      })
    ];
    return Promise.all(writePromises).then(obj => {
      return obj[0];
    });
  }
  
  function declareUpdatePromisesAndPromiseAll(obj) {
    const updatePromises = [
      new Promise((resolve, reject) => {
        interactionServices
          .removeField(obj.newInteraction, { pendingTransaction: 1 })
          .then(data => {
            resolve(obj);
          });
      }),
      new Promise((resolve, reject) => {
        userServices.removePendingTransaction(obj.transaction).then(data => {
          resolve(data);
        });
      })
    ];
    return Promise.all(updatePromises).then(data => {
      return data[0];
    });
  }
  function transactionApplied(obj) {
    obj.transaction.state = "Applied";
    return interactionsTransactionsService.update(obj.transaction).then(data => {
      return obj;
    });
  }
  
  function transactionDone(obj) {
    obj.transaction.state = "Done";
    return interactionsTransactionsService.update(obj.transaction).then(data => {
      return obj;
    });
  }


  function interactionServices.create(model) {
    return conn
       .db()
       .collection("interactions")
       .insert(model)
       .then(data => data);
 }
 
 function interactionServices.removeField(interaction, field) {
    return conn
       .db()
       .collection("interactions")
       .updateOne({ _id: new ObjectId(interaction._id) }, { $unset: field })
       .then(data => {
          return data;
       });
 }
 function usersService.addInteraction(id, doc) {
    return conn
      .db()
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $push: { interactions: doc } })
      .then(data => {
        return data;
      });
  }

 function usersService.removePendingTransaction(doc) {
    return conn
      .db()
      .collection("users")
      .updateOne(
        {
          _id: new ObjectId(doc.users.userId),
          "interactions.pendingTransaction": new ObjectId(doc._id)
        },
        { $unset: { "interactions.$.pendingTransaction": 1 } }
      )
      .then(data => {
        return data;
      });
  }

  function interactionsTransactionsService.create(transaction){
    return conn.db().collection('transactions').insert(transaction)
    .then(id => {
      const transactionId = id.insertedIds[0]
      const string = transactionId.toString()
      return transactionId
    })
}

function interactionsTransactionsService.update(transaction){
    transaction._id = new ObjectId(transaction._id)
    return conn.db().collection('transactions').update({_id: new ObjectId(transaction._id)}, {$set: transaction})
    .then(data => data)
}