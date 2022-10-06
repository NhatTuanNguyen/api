const mainModel 	= require(__path_schemas + 'users');

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
        let limit = parseInt(params.limit) || 4;
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

    updateItems: async (params,task) =>{
        switch(task){
            case 'one':
                const user = await mainModel.findById(params.id);
                const userNew = await user.updateNew(params.body);
                return mainModel.updateOne({_id: params.id},userNew)
        }
    }
}