
// ----------------- GET: lấy dữ liệu từ server về ----------------

function getProductList() {
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/GetAll',//đường dẫn backend cung cấp
        method: 'GET', //method backend cung cấp 

    })

    // xử lý thành công 
    promise.then(function (result) {
        //sau khi lấy dữ liệu từ backend về dùng dữ liệu đó tạo ra tr trên table
        renderProduct(result.data);
    })
    //xử lý thất bại 
    promise.catch(function (err) {
    })

}

// gọi hàm lấy dữ liệu từ server khi trang web vừa load xong
window.onload = function () {
    getProductList();
}

//--------------------GET: tìm kiếm dữ liệu --------------------
var searchInput = document.querySelector("#searchName"),
    searchBtn = document.querySelector('#btnSearch');

searchInput.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        searchBtn.click();
    }
});

searchBtn.onclick = function () {
    var searchName = searchInput.value;
    
    if(searchName.trim() === '') return;

    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/SearchByName/',
        params: {
            name: searchName
        },
        method: 'GET',

    })

    promise.then(function (result) {
        console.log(result.data);
        renderProduct(result.data);
    });

    promise.catch(function (error) {
        console.log(error);
        var html = "<tr><td colspan='7'>No result found</td></tr>"
        document.querySelector('#product-list tbody').innerHTML = html;
    })
}

//--------------------GET: Xóa tìm kiếm dữ --------------------
document.querySelector('#btnClear').onclick = function () {
    searchInput.value = "";
    getProductList();
}

//--------------------POST: thêm/tạo dữ liệu --------------------
document.querySelector('#btnCreate').onclick = function () {
    var validation = new Validation();
    var product = new Product();
    var result = true;
    //lấy thông tin người dùng từ giao diện nhập liệu
    product.id = document.querySelector("#id").value;
    product.name = document.querySelector("#name").value;
    product.price = document.querySelector("#price").value;
    product.img = document.querySelector("#image").value;
    product.description = document.querySelector("#description").value;
    product.type = document.querySelector("#type").value;

   
    if(validation.kiemTraRong(document.querySelector("#name").value,"#error_required_name") == false){
        result = false;
    }

    if(validation.kiemTraRong(document.querySelector("#id").value,"#error_required_id") == false){
        result = false;
    }

    if(result){
        //gọi api đưa dữ liệu về backend
        var promise = axios({
            url: 'http://svcy.myclass.vn/api/Product/CreateProduct',
            method: 'POST',
            data: product //dữ liệu gửi đi

        })

        promise.then(function (result) {
            console.log(result.data);
            getProductList();
        });

        promise.catch(function (error) {
            console.log(error)
        })
    }
}

/**
 * Hàm này sẽ nhận vào 1 array (product) và trả ra output là string <tr>....</tr>
 * @param {*} arrProduct arrProduct là mảng các object product [product1,product2,...]
 * @returns trả ra 1 giá trị là 1 htmlString '<tr>...</tr> <tr>...</tr>'
 */
function renderProduct(arrProduct) { //param : input :arrProduct
    var html = ''; //output: string html 
    for (var i = 0; i < arrProduct.length; i++) {
        var product = arrProduct[i]; //Mỗi lần duyệt lấy ra 1 object product từ mảng {id:'1',name:'...',...}
        if(product.id.length !== 0){
            html += `
                <tr>
                    <td class="id">${product.id}</td>
                    <td class="image"><img src='${product.img}'/></td>
                    <td class="name">${product.name}</td>
                    <td class="price">${product.price}</td>
                    <td class="description">${product.description}</td>
                    <td class="type">${product.type}</td>
                    <td class="action">
                    <button type='button' onclick="productDelete(this,'${product.id}');" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash-can"></i></button>
                    <button type='button' onclick="productEdit('${product.id}');" class="btn btn-primary btn-sm ml-2"><i class="fa-solid fa-pen-to-square"></i></button>
                    </td>
                </tr>
            `;
        }
    }
    // return html;
    document.querySelector('#product-list tbody').innerHTML = html;
}

// --------------DEL: Xoá dữ liệu--------------
function productDelete(deleteBtn, productID) {
    var promise;

    if (confirm('Are you sure you want to delete this product?')) {      
        promise = axios({
            url: 'http://svcy.myclass.vn/api/Product/DeleteProduct/' + productID,
            method: 'DELETE'
        });
    }
    //thành công 
    promise.then(function (result) {
        console.log(result.data);
        getProductList();
    });
    //thất bại 
    promise.catch(function (err) {
        console.log(err);
    });
}

function productEdit(productID) {
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/GetById/' + productID,
        method: 'GET'
    });

    //Thành công 
    promise.then(function (result) {
        var product = result.data
        //đem product load lên các thẻ 
        document.querySelector("#id").value = product.id;
        document.querySelector("#id").disabled = true;
        document.querySelector("#name").value = product.name;
        document.querySelector("#price").value = product.price;
        document.querySelector("#image").value = product.img;
        document.querySelector("#description").value = product.description;
        document.querySelector("#type").value = product.type.toLowerCase();

        document.querySelector("#btnCreate").disabled = true;
        document.querySelector("#btnUpdate").disabled = false;
    });
    //thất bại
    promise.catch(function (error) {

    });
}

//------------------PUT: cập nhật dữ liệu ---------------
document.querySelector('#btnUpdate').onclick = function () {
    var productUpdate = new Product();

    productUpdate.id = document.querySelector("#id").value;
    productUpdate.name = document.querySelector("#name").value;
    productUpdate.price = document.querySelector("#price").value;
    productUpdate.img = document.querySelector("#image").value;
    productUpdate.description = document.querySelector("#description").value;
    productUpdate.type = document.querySelector("#type").value;

    //call API
    var promise = axios({
        url: 'http://svcy.myclass.vn/api/Product/UpdateProduct/' + productUpdate.id,
        method: 'PUT',
        data: productUpdate
    });
    //thành công 
    promise.then(function (result) {
        console.log(result.data);
        getProductList();
        document.querySelector("#id").value = "";
        document.querySelector("#id").disabled = false;
        document.querySelector("#name").value = "";
        document.querySelector("#price").value = "";
        document.querySelector("#image").value = "";
        document.querySelector("#description").value =  "";
        document.querySelector("#type").selectedIndex = 0;
        document.querySelector('#btnCreate').disabled = false;
        document.querySelector('#btnUpdate').disabled = true;
    });
    //thất bại 
    promise.catch(function (err) {
        console.log(err);
    });
}