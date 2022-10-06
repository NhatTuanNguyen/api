const mainModel 	= require(__path_schemas + 'product');

module.exports = {
    create: (item)=>{
        return new mainModel(item).save();
    },

    listItems: (params,task) =>{
        let sort={},select={},find={};
        let queryFind = {...params};

        // Remove Field
        let removeField = ['select','sort'];
        removeField.forEach(param => delete queryFind[param]);
        
        // Find
        let queryStr = JSON.stringify(queryFind);
        queryStr=queryStr.replace(/gt|gte|lt|lte|in/g,find => `$${find}`);
        find = JSON.parse(queryStr);
        
        // Select
        if(params.select) select = params.select.split(',').join(' ');

        // Sort fields
        if(params.sort) sort = params.sort.split(',').join(' ');

        // Pagination
        let page = parseInt(params.page) || 1;
        let limit = parseInt(params.limit) || 3;
        let skip = (page-1)*limit;

        switch(task){
            case 'all':
                return mainModel
                    .find(find)
                    .select(select)
                    .sort(sort)
                    .skip(skip).limit(limit);
            case 'one':
                return mainModel
                    .findById({_id: params.id})
                    .select({});
        }
    },

    deleteItems: (params,task) =>{
        switch(task){
            case 'one':
                return mainModel.deleteOne({_id: params.id})
        }
    },

    updateItems: (params,task) =>{
        switch(task){
            case 'one':
                return mainModel.updateOne({_id: params.id},params.body)
        }
    },

    event: (params,task) =>{
        let type = params.type;
        let number = 1;
        if(type !== 'like' && type !== 'dislike') return
        if(type==='dislike') {
            number = -1;
            type = 'like';
        }
        return mainModel.findByIdAndUpdate({_id: params.id},{$inc: {[type]: number}},{new: true})
    }
}