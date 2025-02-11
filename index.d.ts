/**
 * Type definition for GUChain-manager
 *
 * Type definition file
 *
 */
import { compose } from 'redux';
import { Store } from 'express-session';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }

  namespace Express {
    interface Request {
      auth?: any;
      sessionStore?: Store;
    }
  }
}
