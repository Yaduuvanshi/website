"use client"

import { Container } from "@/components/ui/container"

export default function PrivacyPolicyPage() {
  return (
    <Container>
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy & Terms</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Returns and Refund Policy</h2>
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  No returns are allowed. However, if the product received is damaged/defective/Wrong, then please report the issue to our customer support team within 24 hrs of delivery along with an image of the item delivered. Our team will contact you for additional details of the product delivered if required.
                </p>
                <p className="mb-4">You may choose one of the following:</p>
                <ol className="list-decimal pl-6 mb-4">
                  <li>Get the product re-delivered or</li>
                  <li>Refund in the original mode of payment (amount shall reflect in your account within 7-10 working days as per standard banking timelines)</li>
                </ol>
                <p className="mb-4">We do not offer refund in the following cases:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>If the recipient is not present at the delivery address provided by the sender or refuses to accept the delivery.</li>
                  <li>If product quality concerns are caused by improper handling of the product.</li>
                </ul>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Note:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Complaints need to be made within 24 hours from the time of delivery, after which we will not be able to register any complaints.</li>
                    <li>Complaints against non-delivery need to be made within 5 days from the date of delivery, after which we will not be able to register any complaints.</li>
                    <li>For quality purpose, we might have to get a reverse pick up done for that product, before we can get a redelivery done.</li>
                    <li>We do not accept any request for product exchanges.</li>
                    <li>In the event that we are unable to supply all or part of your order (the product or any substitute product to you at all), we shall notify you as soon as possible and reimburse your payment for the part undelivered.</li>
                  </ul>
                </div>
                <p>
                  Online refund will be processed by Gift Ginnie on confirmation through email or phone call to the customer. Once the refund is processed by Gift Ginnie, it takes 10 to 15 business days to reflect in your account as per standard banking timelines.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  You agree to pay the price applicable and displayed for the product or service on our Website at the time you submitted your order, the delivery fees for the delivery service you selected, if any, or any applicable taxes (defined below). You will be solely responsible for payment of all taxes (other than taxes based on Gift Ginnie's income), fees, duties, and other governmental charges, and any related penalties and interest, arising from the purchase of the products and services not withheld by Gift Ginnie.
                </p>
                <p className="mb-4">
                  All payments are non-refundable (except as expressly set forth in these Terms and Conditions). We reserve the right to charge late fees on all due payments required to be made by the customer which shall be equivalent to the higher of:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>1.5% (one point five percent) per month on the unpaid balance; or</li>
                  <li>the highest rate prescribed under the applicable law.</li>
                </ul>
                <p className="mb-4">
                  You agree to pay for all collection costs, attorney's fees, and court costs incurred in the collection of past due amounts.
                </p>
                <p className="mb-4">
                  "Convenience Charge" may be levied by FNP for facilitation of choosing a product/s and book the delivery, anywhere in India, without visiting our physical store. This covers Gift Ginnie's Internet and system handling costs.
                </p>
                <p>Such Convenience Charges are correlated to the order value.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Order Modification/Cancellation Policy</h2>
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  Gift Ginnie reserves the right to cancel any order for any reason including under any unforeseen circumstances that may come in the way of your order that may be limitations on quantity available of purchase, error in product(s) or pricing information, or limitations of our credit department. Before cancelling any order, we will contact/ notify you.
                </p>
                <p className="mb-4">
                  Orders that are to be delivered the same day are processed immediately and usually cannot be modified/cancelled. However, in case you want to modify/cancel an order, you can reach us on …………………. (10:00 AM to 7:00 AM, 6 days a week). If the order has not been prepared or is not out for delivery, we will try to modify/cancel the order for you. If the order has already been prepared/dispatched, it cannot be cancelled/modified and you will be charged for the order.
                </p>
                <p className="mb-4">
                  In other cases of order modification/cancellation, you shall give at least 24 hours advance notice.
                </p>
                <p>
                  However, if the order has already been prepared/dispatched, it cannot be cancelled/modified and you will be charged for the order. In case of limitations of quantity available of purchase, error in product(s) or pricing information or any other unforeseen circumstances, we reserve the right to cancel your order. You will be notified via email/sms regarding order cancellation and refund.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  )
} 