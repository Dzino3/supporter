import React, { useState, useEffect } from 'react';
import './style/listStyle.css';
import './style/showStatusStayle.css';
import ListItem from './components-info/OrderListItem';
import Checkbox from './Checkbox';
import Axios from 'axios';

function ListForm({ user }) {
  const [orders, setOrders] = useState([]);
  const [amountOfOrdersShown, setAmountOfOrdersShown] = useState(5);
  const [filter, setFilter] = useState(["unsourced","sourced","inventory"])
  const [sort, setSort] = useState({sorting_type: "", ascending: false});

  //gets called once when the landing page loads
  useEffect(() => {
    Axios.post("https://codux.herokuapp.com/order_list", { acc: user.acc, unit: user.unit }).then((response) => {
      if (response.data.length !== 0) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    });

  }, []);

  //decides how many orders are rendered
  const showAll = () => {
    if (amountOfOrdersShown === orders.length) {
      setAmountOfOrdersShown(5)
    } else {
      setAmountOfOrdersShown(orders.length)
    }

  };

  function checkFilter(process_status) {
      var gets_shown = false
      //if the given process_status is mentioned in the filter array then the order gets shown to the user
      filter.map((f) => {
        if (process_status === f) {
          gets_shown = true;
          return;
        }
      })
      return gets_shown;
  }

  function addFilter(fil){
    if (filter.indexOf(fil) > -1){
      //filter exists already so it gets removed
      setFilter(current => current.filter((filter_item) => filter_item !== fil))
    } else{
      setFilter(current => [...current, fil])
    }
  }


  function checkSort(a,b){
    switch(sort.sorting_type){
      case "order_number":
        if(sort.ascending){return a.ORDER_NUMBER > b.ORDER_NUMBER ? 1 : -1}
        else {return a.ORDER_NUMBER > b.ORDER_NUMBER ? -1 : 1}
      case "base_code_description":
        if(sort.ascending){return a.BASE_CODE_DESCR > b.BASE_CODE_DESCR ? 1 : -1}
        else {return a.BASE_CODE_DESCR > b.BASE_CODE_DESCR ? -1 : 1}

    }
  }
  function addSort(sor, isAscending){
    setSort({sorting_type : sor, ascending: isAscending});
    }

  /*
  <Checkbox label="Show Sourced" onClick={()=>addFilter("sourced")} checked={true}></Checkbox>
  <Checkbox label="Show Unsourced" onClick={()=>addFilter("unsourced")} checked={true}></Checkbox>
  <Checkbox label="Show Inventory" onClick={()=>addFilter("inventory")} checked={true}></Checkbox>
  <Checkbox label="Show Canceled" onClick={()=>addFilter("canceled")} checked={false}></Checkbox>
  */ 

  return (
    <>
      <div className='listDiv'>
        {orders.length !== 0 ? <h2 className='listH2'> Your Orders: {orders.length}</h2> : <h2 className='listH2'> Your Orders: </h2>}


        <div className="checkboxDiv">
          <details className="custom-select-Show">
            <summary className="radios-Show">
              <input className='kundenInput-Show' type="radio" name="item-Show" id="default-Show" title="Sort By" checked />
            </summary>
            <ul className="list-Show">
              <li className='kundenLi-Show'>
                <label for="item1-Sort">
                  <input type="button" value="Order Number ↓" onClick={()=>addSort("order_number", false)}></input>
                </label>
              </li>
              <li className='kundenLi-Show'>
                <label for="item2-Sort">
                  <input type="button" value="Order Number ↑" onClick={()=>addSort("order_number", true)}></input>
                </label>
              </li>
              <li className='kundenLi-Show'>
                <label for="item3-Sort">
                <input type="button" value="Model ↓" onClick={()=>addSort("base_code_description", false)}></input>
                </label>
              </li>
              <li className='kundenLi-Show'>
                <label for="item4-Sort">
                <input type="button" value="Model ↑" onClick={()=>addSort("base_code_description", true)}></input>
                </label>
              </li>
            </ul>
          </details>
        </div>

        <div className="checkboxDiv">
          <details className="custom-select-Show">
            <summary className="radios-Show">
              <input className='kundenInput-Show' type="radio" name="item-Show" id="default-Show" title="Show Status" checked />
            </summary>
            <ul className="list-Show">
              <li className='kundenLi-Show'>
                <label for="item1-Show">
                  <Checkbox label="Show Sourced" onClick={()=>addFilter("sourced")} checked={true}></Checkbox>
                  <span></span>
                </label>
              </li>
              <li className='kundenLi-Show'>
                <label for="item2-Show">
                  <Checkbox label="Show Unsourced" onClick={()=>addFilter("unsourced")} checked={true}></Checkbox>
                </label>
              </li>
              <li className='kundenLi-Show'>
                <label for="item3-Show">
                  <Checkbox label="Show Inventory" onClick={()=>addFilter("inventory")} checked={true}></Checkbox>
                </label>
              </li>
              <li className='kundenLi-Show'>
                <label for="item4-Show">
                  <Checkbox label="Show Canceled" onClick={()=>addFilter("canceled")} checked={false}></Checkbox>
                </label>
              </li>
            </ul>
          </details>
        </div>

        

        <div className='wrapper'>
          <div className='accordion'>

            {orders.length !== 0 ?
              //if the backend responded with a list of all order, every order gets displayed
              orders.filter(unfiltered_item => checkFilter(unfiltered_item.PROCESS_STATUS) === true).sort((a,b) => checkSort(a,b)).map((item, index) => {
                //either 5 or all orders are rendered
                if (index < amountOfOrdersShown) {
                  return <ListItem item={item}></ListItem>;
                }
              })
              : <></>}
          </div>
        </div>
        <input className='checkButtonShow' type="button" value={amountOfOrdersShown !== orders.length ? "Show all" : "Show less"} onClick={showAll}></input>

      </div>
    </>
  )
}

export default ListForm
