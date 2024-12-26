// ----------------------------------------------------------------------------

// интерфейс для объекта, передающего параметры
// формы добавления/изменения сведений о поездке
import {Client} from './Client';
import {Route} from './Route';
import {IClientToSelect} from './IClientToSelect';
import {IRouteToSelect} from './IRouteToSelect';

export interface ITripFormParams {

  allClients: Client[],
  allRoutes:  Route[],
  clientList: IClientToSelect[],
  routeList:  IRouteToSelect[]

} // interface ITripFormParams

// ----------------------------------------------------------------------------
