import CampaignModal from './Campaign'
import DialogModal from './Dialog'
import OrderModal from './Order'
import OrderConfirmedModal from './OrderConfirmed'
import PasswordModal from './Password'
import ProductModal from './Product'

const Modal = {
  Dialog: DialogModal,
  Product: ProductModal,
  Campaign: CampaignModal,
  Order: OrderModal,
  OrderConfirmed: OrderConfirmedModal,
  Password: PasswordModal,
}
export default Modal
