beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})


//BONUS TASK: add visual tests for registration form 3

describe('Bonus task 1: Visual tests', () => {

    it('Check that radio button list is correct', () => {

        cy.get('input[type="radio"]').should('have.length', 4)

        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never')

        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })


    it('Check dependencies between Country and City dropdowns', () => {
        //Spain
        cy.get('#country').select("Spain")
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.label)
            expect(actual).to.deep.eq(['', 'Malaga', 'Madrid', 'Valencia', 'Corralejo'])
        })
        cy.get('#city').select("Malaga")

        //Estonia
        cy.get('#country').select("Estonia")
        cy.get('#city').find('option').eq(1).should('not.have.text', 'Malaga')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.label)
            expect(actual).to.deep.eq(['', 'Tallinn', 'Haapsalu', 'Tartu'])
        })
        cy.get('#city').select("Tallinn")

        //Austria
        cy.get('#country').select("Austria")
        cy.get('#city').find('option').eq(1).should('not.have.text', 'Tallinn')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.label)
            expect(actual).to.deep.eq(['', 'Vienna', 'Salzburg', 'Innsbruck'])
        })

    })
    //email format
    it('email filed should accept only correct email format', () => {
        cy.get('[name="email"]').type('wrong')
        cy.get('#emailAlert').should('be.visible').and('contain', 'Invalid email address')
        cy.get('[name="email"]').clear()
        cy.get('[name="email"]').type('correct@gmail.com')
        cy.get('#emailAlert').should('not.be.visible')


    })
})



// BONUS TASK: add functional tests for registration form 3

describe('Bonus task 2: Functional tests for registration form 3', () => {
    it('all fields are filled in + corresponding assertions', () => {

        cy.get('#name').type('Maarit')
        cy.get('[name="email"]').type('correct@gmail.com')
        cy.get('#country').select("Austria")
        cy.get('#city').select("Vienna")
        cy.get('input[type="date"]').first().type('2024-01-05').should('have.value', '2024-01-05')
        cy.get('input[type="radio"]').eq(3).check().should('be.checked')
        cy.get('input[type="date"]').eq(1).type('1990-07-20').should('have.value', '1990-07-20')
        cy.get('[type="checkbox"]').eq(0).check()
        cy.get('[type="checkbox"]').eq(1).check()
        cy.get('[ng-disabled="myForm.$invalid"]').should('be.enabled').click()
        cy.get('h1').contains('Submission received')

    })
    it('only mandatory fields are filled in + corresponding assertions', () => {

        cy.get('[name="email"]').type('correct@gmail.com')
        cy.get('#country').select("Austria")
        cy.get('#city').select("Vienna")
        cy.get('[type="checkbox"]').eq(0).check()
        cy.get('[ng-disabled="myForm.$invalid"]').should('be.enabled').click()
        cy.get('h1').contains('Submission received')

    })

    it('mandatory checkbox is not checked + corresponding assertions', () => {

        inputValidData("correct@gmail.com")
        cy.get('[type="checkbox"]').eq(0).uncheck()
        cy.get('[ng-disabled="myForm.$invalid"]').should('be.disabled')


    })

    it('mandatory email is empty + corresponding assertions', () => {

        inputValidData("correct@gmail.com")
        cy.get('[name="email"]').clear()
        cy.get('#emailAlert').should('be.visible').and('contain', 'Email is required')
        cy.get('[ng-disabled="myForm.$invalid"]').should('be.disabled')


    })

    it('mandatory country selection is empty + corresponding assertions', () => {

        inputValidData("correct@gmail.com")
        cy.get('#country').select('')
        cy.get('[ng-disabled="myForm.$invalid"]').should('be.disabled')


    })

    it('uploading a file + corresponding assertions', () => {
        cy.get('#myFile').selectFile('cypress/fixtures/cypress_logo.png')
        cy.get('button[type="submit"]').click()
        cy.get('h1').contains('Submission received')


    })

})
function inputValidData(email) {
    cy.log('email will be filled')
    cy.get('[name="email"]').type(email)
    cy.get('#country').select("Austria")
    cy.get('#city').select("Vienna")
    cy.get('[type="checkbox"]').eq(0).check()
}


