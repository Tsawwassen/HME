import React, { Component } from 'react';
import UploadOldOrders from './UploadOldOrders';
import ViewOldOrders from './ViewOldOrders';


/**
 * Stale Order Tool
 * - Scan order that are sitting on a shelf
 * - Compare current list with previous list
 * - If the order is new, save the order
 * - If the order is in the previous list, keep the order
 * - If the order is not in the new list, delete it (?)
 * - - Maybe add a database column with a date of when an old order was not on the new order audit
 * - Show a list of orders on the shelf, highlighting orders that have been sitting on the shelf from previous order audit
 * -
 */

/**
 * V1
 * - Use input file to complete task - DONE
 */

/**
 * Plan of Action
 * - Delete all data from database
 * - Parse given NEW order file (columns should be order number and rep)
 * - compare NEW orders with OLD orders (from database)
 */


class StaleOrder extends Component  {
    constructor(props){
      super(props);
      this.state = {
        orders: []
      };
      
      this.setOrders = this.setOrders.bind(this);
      this.removeDuplicates = this.removeDuplicates.bind(this);
      this.compareNewAndOldOrders = this.compareNewAndOldOrders.bind(this);

      this.intersectingOrders = this.intersectingOrders.bind(this);
    }

    removeDuplicates(data){
      return data.filter((data, index, self) =>
        index === self.findIndex((t) => (t.orderNumber === data.orderNumber )))
    }

    intersectingOrders(oldOrders, newOrders){
      var result = [];
      
      oldOrders.forEach(oldOrder => {
        // iterating over second array
        newOrders.forEach(newOrder => {
            // push into output array only if total is 90 & tip is 0
            if (oldOrder.orderNumber === newOrder.orderNumber )  {
                result.push(oldOrder);
            }
        });
      });
      return result;
    }
    compareNewAndOldOrders(newOrders){
      /** 
      * 3. Compare orders with database and update as needed
      * 3a.* - - If NEW order.order_number is in OLD orders
      * - - - Add NEW order to return list
      * - - If NEW order.order_number is not in OLD orders
      * - - - Add NEW order to return list
      * - - If OLD order.order_number is not in NEW orders
      * - - - Delete from server
      */
      let oldOrders = this.state.orders;

      // Find orders intersecting (orders that where recorded last time the audit was done)
      let intersectingOrders = this.intersectingOrders(oldOrders, newOrders);
      // Find orders that are only in oldOrders (to be deleted)
      // Merge intersection orders and newOrders (remove duplicates, keep comment)
      console.log("---New Order---");
      console.log(newOrders);
      console.log("---Old Order---");
      console.log(oldOrders);
      console.log("---Intersecting Order---");
      console.log(intersectingOrders)
    }

    //Would rather pass the setState function to the UploadOldOrders component and not have a function to handle this
    // // Not sure what way of doing it is good practise.
    setOrders(data){
      /** Plan of action
      * 1. check for duplicate order numbers
      * 2. Sort data by rep, then order number
      * 3. Compare orders with database and update as needed
      * 3a.* - - If NEW order.order_number is in OLD orders
      * - - - Add NEW order to return list
      * - - If NEW order.order_number is not in OLD orders
      * - - - Add NEW order to return list
      * - - If OLD order.order_number is not in NEW orders
      * - - - Delete from server
      */
      
      data = this.removeDuplicates (data);
      this.compareNewAndOldOrders(data);
      this.setState({orders: data});
    }

    /**  Not sure if this fetch call should be in the UploadOldOrders component or left here
     * The thinking behind leaving it here is that when the component is mounted, it should get the old data, and then updated when a file is uploaded
     * The thinking behind putting it in the UploadOldOrders component is that the component is getting a setState prop that would get used when a file is uploaded
    */
    componentDidMount(){
      fetch("http://localhost:8080/orders")
      .then(response => {
        return response.json();
      }).then(data => {
        //console.log(data.data);
        this.setState({orders: data.data});
        //return data;
      })
      .catch(error => {
        console.error(error);
      });
    }

    render() {
        return (<>
            <h1>StaleOrder</h1>
            <UploadOldOrders set={this.setOrders} />
            <ViewOldOrders data={this.state.orders} />
        </>);
      }
  }
  
  export default StaleOrder;