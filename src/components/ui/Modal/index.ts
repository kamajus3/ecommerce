import CampaignModal from './Campaign'
import ConfirmOrderModal from './ConfirmOrder'
import DialogModal from './Dialog'
import OrderConfirmedModal from './OrderConfirmed'
import PasswordModal from './Password'
import ProductModal from './Product'

const Modal = {
  Dialog: DialogModal,
  Product: ProductModal,
  Campaign: CampaignModal,
  ConfirmOrder: ConfirmOrderModal,
  OrderConfirmed: OrderConfirmedModal,
  Password: PasswordModal,
}
export default Modal
