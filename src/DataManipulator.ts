import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc:number,
  price_def:number,
  ratio:number,
  timestamp:Date,
  upper_bound:number,
  lower_bound:number,
  trigger_alert:number|undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]):Row {
    const abc = serverResponds[0]
    const def = serverResponds[1]
    const price_abc = this.getPrice(abc)
    const price_def = this.getPrice(def)
    const ratio = this.calculateRatio(price_abc,price_def)


    return {
      price_abc,
      price_def,
      ratio,
      lower_bound:this.lowerBound,
      upper_bound:this.upperBound,
      timestamp: this.getTimeStamp(abc.timestamp,def.timestamp),
      trigger_alert: this.calculateTriggerAlert(ratio),

    }

  }

  private static upperBound = 1.05
  private static lowerBound = 0.95

  private static calculateRatio(price1:number,price2:number){
    return price1 / price2
  }

  private static getPrice(datapoint:ServerRespond){
    return (datapoint.top_ask.price + datapoint.top_bid.price) / 2
  }

  private static getTimeStamp(timestamp1:Date, timestamp2:Date){
    if (timestamp1 > timestamp2){
      return timestamp1
    }
    return timestamp2
  }

  private static calculateTriggerAlert(ratio:number){
    if (ratio > this.upperBound || ratio < this.lowerBound){
      return ratio
    }
  }

}
