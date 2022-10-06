const mainModel 	= require(__path_schemas + 'category');
const productModel 	= require(__path_schemas + 'product');

module.exports = {
    create: (item)=>{
        return new mainModel(item).save();
    },

    listItems: (params,task) =>{
        let id = params.id ? params.id : '';
        params = params.id ? params.query : params;
        let sort={},select={},find={};
        // copy params
        let queryFind = {...params};
        // Remove Field
        let removeField = ['select','sort','limit'];
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
        let limit = parseInt(params.limit) || 6;
        let skip = (page-1)*limit;

        switch(task){
            case 'all':
                return mainModel
                    .find(find)
                    .populate({path: 'product', select: 'name'})
                    .select(select)
                    .sort(sort)
                    .skip(skip).limit(limit);
            case 'getProduct':
                if (id !== 'all') Object.assign(find,{'category.id': id});
                return productModel
                    .find(find)
                    .select(select)
                    .sort(sort)
                    .skip(skip).limit(limit);
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
}