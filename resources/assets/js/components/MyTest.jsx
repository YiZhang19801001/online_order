import React from "react";
import axios from "axios";
class MyTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      table_no: "A02",
      order_id: "2151",
      cdt: "20190306",
      v: "abc",
      numberOfTry: 10,
      test_status: 0,
      shoppingCartList: [],
      responseMsg: [],
      timeOut: 1000
    };

    this.renderLoading = this.renderLoading.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.renderResult = this.renderResult.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.startTest = this.startTest.bind(this);
    this.addOrderItem = this.addOrderItem.bind(this);
    this.getTotalPrice = this.getTotalPrice.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
    this.testRun = this.testRun.bind(this);
  }
  handleOnChange(e) {
    const property = e.target.name;
    if (e.target.name === "numberOfTry" || e.target.name === "timeOut") {
      this.setState({ [property]: parseInt(e.target.value) });
    }
    this.setState({ [property]: e.target.value });
  }
  startTest() {
    this.setState({ test_status: 1 });
    for (let index = 0; index < this.state.numberOfTry; index++) {}

    const response = this.testRun();
    response.then(res => {
      this.confirmOrder();
    });
  }

  async testRun() {
    setTimeout(this.addOrderItem, this.state.timeOut);
  }
  addOrderItem() {
    const sampleProduct = {
      product_id: 4,
      name: "泰汁蒸盲曹",
      price: "24.90",
      upc: "1104",
      description: "",
      status: 1,
      image: "4.jpg",
      choices: [],
      options: []
    };
    this.props.updateShoppingCartList(
      true,
      sampleProduct,
      "table",
      "add",
      this.state.order_id,
      this.state.table_no
    );
  }

  confirmOrder() {
    axios
      .post(`/table/public/api/confirm`, {
        orderList: this.state.shoppingCartList,
        order_id: this.state.order_id,
        store_id: "4",
        store_name: "some store",
        store_url: "http://kidsnparty.com.au/table/public",
        total: this.getTotalPrice(),
        paymentMethod: "Dive in",
        v: this.state.v,
        lang: this.props.lang,
        userId: this.props.userId
      })
      .then(res => {
        this.setState({
          responseMsg: [...this.state.responseMsg, res.data],
          shoppingCartList: []
        });
        // this.props.updateHistoryCartList(res.data.historyList);
      })
      .catch(err => {
        this.setState({
          responseMsg: [...this.state.responseMsg, err.response]
        });
      });
  }

  getTotalPrice() {
    let sum = 0;

    this.state.shoppingCartList.map(orderItem => {
      sum += orderItem.quantity * orderItem.item.price;
    });

    return sum.toFixed(2);
  }

  renderLoading() {
    if (this.state.test_status === 0) {
      return null;
    }
    let index = 0;

    return (
      <div className="loading-cover">
        {this.state.responseMsg.map(msg => {
          index++;

          return (
            <div key={`responseMsg${index}`} className="response-message">
              <p>第 {index} 轮: 尝试加菜，并下单，服务器返回值：</p>
              <span>{JSON.stringify(msg)}</span>
            </div>
          );
        })}
        <div
          onClick={() => {
            this.setState({ test_status: 0, responseMsg: [] });
          }}
          className="btn-reset-test"
        >
          more tests
        </div>
      </div>
    );
  }

  renderForm() {
    if (this.state.test_status !== 0) {
      return null;
    }
    return (
      <div className="setting-form">
        <div className="setting-form-field">
          <label>
            <p>enter number of tests: </p>
            <input
              name="numberOfTry"
              type="number"
              value={this.state.numberOfTry}
              onChange={this.handleOnChange}
            />
          </label>
        </div>
        <div className="setting-form-field">
          <label>
            <p>enter table no: </p>
            <input
              name="table_no"
              type="text"
              value={this.state.table_no}
              onChange={this.handleOnChange}
            />
          </label>
        </div>
        <div className="setting-form-field">
          <label>
            <p>enter order id: </p>
            <input
              name="order_id"
              type="text"
              value={this.state.order_id}
              onChange={this.handleOnChange}
            />
          </label>
        </div>
        <div className="setting-form-field">
          <label>
            <p>enter cdt: </p>
            <input
              name="cdt"
              type="text"
              value={this.state.cdt}
              onChange={this.handleOnChange}
            />
          </label>
        </div>
        <div className="setting-form-field">
          <label>
            <p>enter v: </p>
            <input
              name="v"
              type="text"
              value={this.state.v}
              onChange={this.handleOnChange}
            />
          </label>
        </div>
        <div className="setting-form-field">
          <label>
            <p>enter timeout between submit order(ms): </p>
            <input
              name="timeOut"
              type="number"
              value={this.state.timeOut}
              onChange={this.handleOnChange}
            />
          </label>
        </div>
        <div className="btn-start-test" onClick={this.startTest}>
          start test
        </div>
      </div>
    );
  }

  renderResult() {
    if (this.state.test_status !== -1) {
      return null;
    }
    return <div className="result-message">Test is done</div>;
  }

  render() {
    return (
      <div className="component-my-test">
        {this.renderLoading()}
        {this.renderForm()}
        {this.renderResult()}
      </div>
    );
  }
}

export default MyTest;
