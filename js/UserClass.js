class User {
    constructor(id, username, password, email, firstname, lastname, phone, address) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = {
            firstname: firstname,
            lastname: lastname
        };
        this.phone = phone;
        this.address = address;
    }
}

class Address {
    constructor(city, village, street, number, zipcode, geolocation) {
        this.city = city;
        this.village = village;
        this.street = street;
        this.number = number;
        this.zipcode = zipcode;
        this.geolocation = geolocation;
    }
}

class Geolocation {
    constructor(lat, long) {
        this.lat = lat,
        this.long = long
    }
}