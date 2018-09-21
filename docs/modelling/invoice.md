# Customer work (per year)

## references

 * https://www.gov.uk/invoicing-and-taking-payment-from-customers

## use cases

 * add time or materials to a timesheet/ bill of materials against a customer
 * create an invoice for review then issue

## api model

 * add timesheet entry: "I (employee) worked for this number of hours/days for this customer"
 * edit timesheet entry

## db model

 * partition key: customer
 * sort key: year

 * id (human readable but unique)
 * date issued
 * contactor company (id to contact)
 * customer (id to contact)

 * charge (goods/services):
   * description of charge
   * date provided
   * 1 or more Lines of:
     * time:
       * hours/days
       * rate
       * description
       * line total
     * materials:
       * ?

 * totals
   * amount charged
   * VAT amount
   * total amount owed
