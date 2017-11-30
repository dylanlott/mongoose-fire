# mongoose-fire

> Make any model emit events on create, update, and delete. 

# Install 

`npm install --save mongoose-fire`

Then attach it to each model that you want to be an event emitter

```
const mongoosefire = require('mongoose-fire'); 
exampleSchema.plugin(mongoosefire);

```

And you're done!

# Events 

Once these plugins are installed, you can access the following events:

```
Model.on('create')

Model.on('update')

Model.on('update:<attr>')

Model.on('remove')

```

## Notice about Middleware hooks 

Events won't be fired when `findByIdAndUpdate` and other similar aggregate methods are used 
To get an event to fire, you'll have to manually edit the document and manually call the `save()` method. 
This is because of the way Mongoose handles `findByIdAndUpdate` behind the scenes with the MongoDB driver. 

Example

```javascript

Model.findByIdAndUpdate(id, { update: 'with this' }, (err, data) => {
  // this won't fire the `update` or `update:<attr>` method 
})

// instead you need to do 
Model.findOne({ foo: 'bar' })
  .then((doc) => {
    doc.foo = 'baz'
    doc.save(); // the `update` and `update:foo` events will now be fired 
  })

// and in callback style
Model.findOne({ foo: 'bar'}, function (err, doc) {
  doc.foo = 'baz'
  doc.save(); // `update` and `update:foo` events will now be fired
});
```

In general, I prefer to manually find and edit documents this way anyway. 
