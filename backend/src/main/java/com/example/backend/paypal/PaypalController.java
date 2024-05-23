package com.example.backend.paypal;

import com.example.backend.order.Order;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/paypal")
public class PaypalController {

    @Autowired
    private APIContext apiContext;

    @PostMapping("/pay")
    public ResponseEntity<String> pay(@RequestBody Order order) {
        try {
            Payment payment = createPayment(order);
            for(Links link : payment.getLinks()) {
                if(link.getRel().equals("approval_url")) {
                    return ResponseEntity.ok(link.getHref());
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No approval URL found");
        } catch (PayPalRESTException e) {
            throw new RuntimeException("Error creating PayPal payment", e);
        }
    }

    @GetMapping("/success")
    public ResponseEntity<String> success(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = executePayment(paymentId, payerId);
            return ResponseEntity.ok(payment.toJSON());
        } catch (PayPalRESTException e) {
            throw new RuntimeException("Error processing PayPal payment", e);
        }
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> cancel() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment cancelled");
    }

    private Payment createPayment(Order order) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency("PLN");
        amount.setTotal(order.getPrice());

        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription("Payment description");

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("paypal");

        Payment payment = new Payment();
        payment.setIntent("sale");
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl("http://localhost:5173/cancel");
        redirectUrls.setReturnUrl("http://localhost:5173/success");
        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    private Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = Payment.get(apiContext, paymentId);

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);

        return payment.execute(apiContext, paymentExecution);
    }
}
