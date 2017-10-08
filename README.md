# mongoose-fire

> Make any model emit events on create, update, and delete. 

# Install 

`npm install mongoose-fire`

Then attach it to each model that you want to be an event emitter

```
const mongoose-fire = require('mongoose-fire'); 
exampleSchema.plugin(mongoose-fire);

```

And you're done!

# Events 

Once these plugins are installed, you can then access the following events 

```
Model.on('create')

Modle.on('update')

Model.on('update:<attr>')

Modle.on('remove')

```

## Notice about Middleware hooks 

Events won't be fired when `findByIdAndUpdate` and other similar aggregate methods are used 
To get an event to fire, you'll have to manually edit the document and manually call the `save()` method. 
This is because of the way Mongoose handles `findByIdAndUpdate` behind the scenes with the MongoDB driver. 
