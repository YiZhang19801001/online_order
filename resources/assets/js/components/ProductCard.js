import React, { Component } from "react";

import ChoiceForm from "./ChoiceForm";
import ButtonIncrease from "./ButtonIncrease";
import ButtonDecrease from "./ButtonDecrease";
import ProductDetails from "./ProductDetails";

export default class ProductCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnSub: "",
      btnPlus: "",
      toggleChoiceForm: false,
      quantity: 0,
      isZoomInPic: false
    };

    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.makeChoice = this.makeChoice.bind(this);
    this.closeChoiceForm = this.closeChoiceForm.bind(this);
    this.getProductQtyInOrderList = this.getProductQtyInOrderList.bind(this);
    this.changePicSize = this.changePicSize.bind(this);
    this.renderSoldOutTag = this.renderSoldOutTag.bind(this);
    this.renderControlPannel = this.renderControlPannel.bind(this);
    this.removerItem = this.removerItem.bind(this);
  }

  componentDidMount() {
    this.setState({
      btnPlus: "/table/public/images/layout/btn_plus_red.png"
    });

    const flag =
      this.props.product.choices.length > 0 ||
      this.props.product.options.length > 0;
    const buttonImg = flag
      ? "/table/public/images/layout/btn_sub_grey.png"
      : "/table/public/images/layout/btn_sub_red.png";

    this.setState({ btnSub: buttonImg });
    if (this.props.mode !== "menu") {
      this.getProductQtyInOrderList(
        this.props.shoppingCartList,
        this.props.historyCartList
      );
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.mode !== "menu") {
      this.getProductQtyInOrderList(
        newProps.shoppingCartList,
        newProps.historyCartList
      );
    }
  }

  getProductQtyInOrderList(arr, historyList) {
    let Qty = 0;
    arr.map(orderItem => {
      if (orderItem.item.product_id === this.props.product.product_id) {
        Qty += orderItem.quantity;
      }
    });
    this.setState({ quantity: Qty });
  }

  renderSoldOutTag() {
    if (parseInt(this.props.product.status) === 1) {
      return null;
    }
    return <div className="sold-out-tag">{this.props.app_conf.sold_out}</div>;
  }

  makeChoice() {
    this.setState({ toggleChoiceForm: true });
  }

  closeChoiceForm() {
    this.setState({ toggleChoiceForm: false });
  }
  changePicSize() {
    this.setState({
      isZoomInPic: !this.state.isZoomInPic
    });
  }
  increase() {
    this.props.updateShoppingCartList(
      true,
      this.props.product,
      this.props.mode,
      "add",
      this.props.orderId,
      this.props.tableNumber
    );
  }

  decrease() {
    this.props.updateShoppingCartList(
      true,
      this.props.product,
      this.props.mode,
      "sub",
      this.props.orderId,
      this.props.tableNumber
    );
  }

  removerItem() {
    this.props.updateShoppingCartList(
      true,
      this.props.product,
      this.props.mode,
      "remove",
      this.props.orderId,
      this.props.tableNumber
    );
  }

  renderControlPannel() {
    const isSimpleProduct =
      this.props.product.options.length === 0 &&
        this.props.product.choices.length === 0
        ? true
        : false;
    // product not being ordered yet, only add button appear
    if (this.state.quantity <= 0) {
      return (
        <div className="control-pannel">
          <div className="btn-plus-only">
            <ButtonIncrease
              onClick={isSimpleProduct ? this.increase : this.makeChoice}
              mode="fill"
            />
          </div>
        </div>
      );
    }
    // product is ordered, show 1. decrease button 2. quantity 3. increase button
    if (
      (this.state.quantity > 0 && isSimpleProduct) ||
      (this.state.quantity > 1 && !isSimpleProduct)
    ) {
      return (
        <div className="control-pannel">
          <div
            onClick={
              isSimpleProduct
                ? this.decrease
                : () => {
                  this.props.showOrderList();
                }
            }
            className="btn-sub"
          >
            <ButtonDecrease mode="fill" isDisable={!isSimpleProduct} />
          </div>
          <span className="number-quantity">{this.state.quantity}</span>
          <div
            onClick={isSimpleProduct ? this.increase : this.makeChoice}
            className="btn-plus"
          >
            <ButtonIncrease mode="fill" />
          </div>
        </div>
      );
    }
    if (this.state.quantity === 1 && !isSimpleProduct) {
      return (
        <div className="control-pannel">
          <div onClick={this.removerItem} className="btn-sub">
            <ButtonDecrease mode="fill" isDisable={isSimpleProduct} />
          </div>
          <span className="number-quantity">{this.state.quantity}</span>
          <div onClick={this.makeChoice} className="btn-plus">
            <ButtonIncrease mode="fill" />
          </div>
        </div>
      );
    }
  }
  render() {
    return (
      <div className="product-card">
        {this.state.isZoomInPic ? (
          <ProductDetails
            product={this.props.product}
            close={() => {
              this.setState({ isZoomInPic: false });
            }}
          />
        ) : null}
        <div onClick={this.changePicSize} className={"img-container"}>
          <img
            src={`/table/public/images/items/${this.props.product.image}`}
            alt={this.props.product.name}
          />
        </div>
        <div className="product-info">
          <div className="product-name">{this.props.product.name}</div>
          <div className="price-quantity">
            <div className="price"><span className={`defaultPriceTag`}>{this.props.app_conf.defaultPriceTag}</span> ${this.props.product.price}</div>
            {this.props.mode !== "menu" &&
              parseInt(this.props.product.status) === 1
              ? this.renderControlPannel()
              : null}
            {this.renderSoldOutTag()}
          </div>
        </div>
        {this.state.toggleChoiceForm ? (
          <ChoiceForm
            closeChoiceForm={this.closeChoiceForm}
            product={this.props.product}
            updateShoppingCartList={this.props.updateShoppingCartList}
            app_conf={this.props.app_conf}
            mode={this.props.mode}
            orderId={this.props.orderId}
            tableNumber={this.props.tableNumber}
          />
        ) : null}
      </div>
    );
  }
}
