import { ApiService } from '../ApiService'

export class CoreApiService extends ApiService {
  protected apiPath = 'coreapi'
  protected methodPrefix = 'hypersdk.'

  // Other specific methods can be added here
}
