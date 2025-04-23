// ----------------------------------------------------------------------------

// интерфейс для объекта, передающего параметры
// формы добавления/изменения сведений о поездке
import {ClientTemp} from './ClientTemp';
import {Route} from './Route';
import {IClientToSelect} from './IClientToSelect';
import {IRouteToSelect} from './IRouteToSelect';

export interface ITripFormParams {

  allClients: ClientTemp[],
  allRoutes:  Route[],
  clientList: IClientToSelect[],
  routeList:  IRouteToSelect[]

} // interface ITripFormParams

// ----------------------------------------------------------------------------
