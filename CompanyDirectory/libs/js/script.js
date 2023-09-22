var searchActive;

//Personnel Functions

async function getPersonnel() {
    try {
        const response = await $.ajax({
            url: "libs/php/getAllPersonnel.php",
            method: "GET"
        });

        const data = await JSON.parse(response);
        employees = data.data;
        return employees

    } catch (e) {
        console.log(e);
    }
}

async function displayPersonnel(employees) {

    const personnel = employees.map(employee => {
        return `<tr id="employee-tr">
            <td><i class="fa-solid fa-user"></i> ${employee.firstName} ${employee.lastName}</td>
            <td class="d-none d-sm-table-cell"><i class="fa-solid fa-at"></i> ${employee.email}</td>
            <td class="d-none d-sm-table-cell"><i class="fa-solid fa-briefcase"></i> ${employee.department}</td>
            <td class="text-end"><button id="editEmp" type="button" class="btn btn-secondary btn-sm editBtn" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" data-id="${employee.id}"><i class="fa-solid fa-pen"></i></button></td>
            <td class="text-end"><button id="deleteEmp" type="button" class="btn btn-danger btn-sm deleteBtn" data-bs-toggle="modal" data-bs-target="#areYouSureDeleteEmpModal" data-id="${employee.id}"><i class="fa-solid fa-trash-can"></i></button></td>   
        </tr>`
    })


    const personnelTable = `<table class="table directory-table">${personnel.join('')}</table>`;

    $('.directory-table').html(personnelTable);

    return personnel;

}

async function editPersonnel(firstName, lastName, jobTitle, email, department_id, id) {
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    const capitalizedJobTitle = jobTitle.charAt(0).toUpperCase() + jobTitle.slice(1).toLowerCase();
    const lowerEmail = email.toLowerCase();

    try {

        const response = await $.ajax({
            url: "libs/php/editPersonnel.php",
            method: "POST",
            dataType: "JSON",
            data: {
                firstName: capitalizedFirstName,
                lastName: capitalizedLastName,
                jobTitle: capitalizedJobTitle,
                email: lowerEmail,
                department_id: department_id,
                id: id
            }
        });



        if (response.data == 'Query Failed') {
            $('#editEmployeeModal').modal("hide");
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        if ($('#employees-tab').hasClass('active')) {
            getPersonnel().then(() => {
                sortPersonnel($('.sort').val());
                $('#editEmployeeModal').modal("hide");
                $('#success').text(`Employee Successfully Updated`)
                $('#success-modal').modal('show');
                $('#success-modal').delay(1000).fadeOut('slow');

                setTimeout(() => {
                    $('#success-modal').modal('hide');
                }, 1500);
            })

        } else {
            const query = $('#search').val();
            search(query);
            $('#editEmployeeModal').modal("hide");
            $('#editEmployeeModal').modal("hide");
            $('#success').text(`Employee Successfully Updated`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        }


    } catch (e) {
        throw e;
    }
}

async function deletePersonnel(id) {
    try {
        const response = await $.ajax({
            url: "libs/php/deletePersonnel.php",
            method: "POST",
            dataType: "JSON",
            data: {
                id: id
            }
        });



        if (response.data == 'Query Failed') {
            $('#employee-modal').modal('hide');
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        if ($('#employees-tab').hasClass('active')) {
            getPersonnel().then(() => {
                sortPersonnel($('.sort').val());;
                $('#employee-delete-modal').modal("hide");
                $('#success').text(`Employee Successfully Deleted`)
                $('#success-modal').modal('show');
                $('#success-modal').delay(1000).fadeOut('slow');

                setTimeout(() => {
                    $('#success-modal').modal('hide');
                }, 1500);
            })

        } else {

            const query = $('#search').val();
            search(query);
            $('#employee-delete-modal').modal("hide");
            $('#success').text(`Employee Successfully Deleted`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        }

    } catch (e) {
        console.log(e);
        throw (e);
    }
}

async function addPersonnel(firstName, lastName, jobTitle, email, department_id) {
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    const capitalizedJobTitle = jobTitle.charAt(0).toUpperCase() + jobTitle.slice(1).toLowerCase();
    const lowerEmail = email.toLowerCase();

    try {
        const response = await $.ajax({
            url: "libs/php/insertPersonnel.php",
            method: "POST",
            dataType: "JSON",
            data: {
                firstName: capitalizedFirstName,
                lastName: capitalizedLastName,
                jobTitle: capitalizedJobTitle,
                email: lowerEmail,
                department_id: department_id
            }
        });


        if (response.data == 'Query Failed') {
            $('#addEmployeeModal').modal("hide");
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }


        if (response.data == 'User already exists') {
            $('#user-exists-modal').modal('show');
            return;
        }

        getPersonnel().then(() => {
            sortPersonnel($('.sort').val());
            $('#addEmployeeModal').modal("hide");
            $('#success').text(`Employee Successfully Added`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        })

        $('#employee-firstName-input').val('');
        $('#employee-lastName-input').val('');
        $('#employee-email-input').val('');


    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function sortPersonnel(sortVal) {

    var employees = await getPersonnel();

    if (sortVal == 'L-F') {
        employees.sort((a, b) => {
            const nameA = a.lastName.toUpperCase();
            const nameB = b.lastName.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        })
        displayPersonnel(employees);
    };

    if (sortVal == 'F-L') {
        employees.sort((a, b) => {
            const nameA = a.firstName.toUpperCase();
            const nameB = b.firstName.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        })
        displayPersonnel(employees);
    };
}


//Add Employee

$('#addEmployeeForm').on("submit", function (e) {

    // stop the default browser behviour

    e.preventDefault();

    addPersonnel($('#firstName-add').val(), $('#lastName-add').val(), $('#jobTitle-add').val(), $('#emailAddress-add').val(), $('#department-select-add').val());

})

$('#addEmployeeModal').on('show.bs.modal', async function () {

    var departments = await getDepartments();

    const department = departments.map(dept => {
        return `<option value="${dept.id}">${dept.name}</option>`
    });

    $('#department-select-add').append(department);

})

$('#addEmployeeModal').on('shown.bs.modal', function () {

    $('#firstName-add').focus();

});

$('#addEmployeeModal').on('hidden.bs.modal', function () {

    $('#addEmployeeForm')[0].reset();

});

// Edit Employee

// Executes when the form button with type="submit" is clicked

$('#editEmployeeForm').on("submit", function (e) {

    // stop the default browser behviour

    e.preventDefault();

    // AJAX call
    editPersonnel($('#firstName-edit').val(), $('#lastName-edit').val(), $('#jobTitle-edit').val(), $('#emailAddress-edit').val(), $('#department-select-edit').val(), $('#employeeID').val());

})

// The modal "show" event is triggered when the $('#...').modal('show')
// is requested and executes before the modal is visible

$('#editEmployeeModal').on('show.bs.modal', function (e) {

    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {

            var resultCode = result.status.code

            if (resultCode == 200) {

                // Update the hidden input with the employee id so that
                // it can be referenced when the form is submitted

                $('#employeeID').val(result.data.personnel[0].id);

                $('#firstName-edit').val(result.data.personnel[0].firstName);
                $('#lastName-edit').val(result.data.personnel[0].lastName);
                $('#jobTitle-edit').val(result.data.personnel[0].jobTitle);
                $('#emailAddress-edit').val(result.data.personnel[0].email);


                $('#department-select-edit').html("");


                $.each(result.data.department, function () {

                    $('#department-select-edit').append($("<option>", {
                        value: this.id,
                        text: this.name
                    }, "</option>"));

                })



            } else {

                $('#editEmployeeModal .modal-title').replaceWith("Error retrieving data");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#editEmployeeModal .modal-title').replaceWith("Error retrieving data");
        }
    });

})

// The "shown" event triggers after the modal appears
// and can be used to run commands that won't work on hidden elements

$('#editEmployeeModal').on('shown.bs.modal', function () {

    // You may optionally use the the following command to place 
    // the cursor in the first input as a courtesy to the user.
    // Commands like this that manipulate the state of a control
    // will only work once it is visible which is why it is in
    // the "shown" event handler

    $('#firstName-edit').focus();

});

// The "hide" and "hidden" events trigger before and after
// the modal disappears and can be used to clear down the form.
// This is useful if the form needs to be empty the next time 
// that it is shown

$('#editEmployeeModal').on('hidden.bs.modal', function () {

    $('#editEmployeeForm')[0].reset();

});

// Delete Employee 

$('#areYouSureDeleteEmpModal').on('show.bs.modal', function (e) {

    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {

            var resultCode = result.status.code

            if (resultCode == 200) {

                // Update the hidden input with the employee id so that
                // it can be referenced when the form is submitted

                $('#areYouSureNameEmp').text(result.data.personnel[0].firstName + " " + result.data.personnel[0].lastName);

                $('#deleteEmployeeID').val(result.data.personnel[0].id);


            } else {

                $('#areYouSureDeleteEmpModal .modal-title').replaceWith("Error retrieving data");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#areYouSureDeleteEmpModal .modal-title').replaceWith("Error retrieving data");
        }
    });


});


$('#confirm-delete-employee').on('click', function () {

    deletePersonnel($('#deleteEmployeeID').val());

});


//Department Functions


async function getDepartments() {
    try {
        const response = await $.ajax({
            url: "libs/php/getAllDepartments.php",
            method: "GET"
        });

        departments = response.data;

        return departments;

    } catch (e) {
        console.log(e);
        throw (e);
    }
}

async function displayDepartments(departments) {

    const locations = await getLocations();

    const department = departments.map(department => {

        var location = locations.find(location => location.id == department.locationID);
        return `<tr>
            <td><i class="fa-solid fa-briefcase"></i> ${department.name}</td>
            <td> <i class="fa-solid fa-location-dot"></i> ${location.name}</td>
            <td><button id="editDept" type="button" class="btn btn-secondary btn-sm editBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}"><i class="fa-solid fa-pen"></i></button></td>
            <td><button id="deleteDept" type="button" class="btn btn-danger btn-sm deleteBtn" data-id="${department.id}"><i class="fa-solid fa-trash-can"></i></button></td>
         </tr>`

    })

    const departmentTable = `<table class="table directory-table">${department.join('')}</table>`;

    $('.directory-table').html(departmentTable);

    return department;

}

async function addDepartment(name, locationID) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    try {
        const response = await $.ajax({
            url: "libs/php/insertDepartment.php",
            method: "POST",
            dataType: "JSON",
            data: {
                name: capitalizedName,
                locationID: locationID
            }
        });



        if (response.data == 'Query Failed') {
            $('#addDepartmentModal').modal('hide');
            $('#addDepartmentModal').modal('hide');
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        getDepartments().then(() => {
            sortDepartment($('.sort').val());
            $('#addDepartmentModal').modal('hide');
            $('#success').text(`Department Successfully Added`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        })

        $('#department-name-input').val('');

    } catch (e) {
        throw e;
    }
}

async function deleteDepartment(id) {
    try {
        const response = await $.ajax({
            url: "libs/php/deleteDepartment.php",
            method: "POST",
            dataType: "JSON",
            data: {
                id: id
            }
        });


        if (response.data == 'Query Failed') {
            $('#areYouSureDeleteDeptModal').modal('hide');
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        if (response.data == 'Integrity Constraint Violation') {
            $('#areYouSureDeleteDeptModal').modal('hide');
            $('#failed').text(`Unable To Delete Due To Referential Integrity`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(3000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        if ($('#department-tab').hasClass('active')) {
            getDepartments().then(() => {
                sortDepartment($('.sort').val());
                $('#areYouSureDeleteDeptModal').modal('hide');
                $('#success').text(`Department Successfully Deleted`)
                $('#success-modal').modal('show');
                $('#success-modal').delay(1000).fadeOut('slow');

                setTimeout(() => {
                    $('#success-modal').modal('hide');
                }, 1500);
            })

        } else {
            const query = $('#search').val();
            search(query);
            $('#areYouSureDeleteDeptModal').modal('hide');
            $('#success').text(`Department Successfully Deleted`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        }


    } catch (e) {
        throw e
    }
}

async function editDepartment(name, locationID, departmentID) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    try {
        const response = await $.ajax({
            url: "libs/php/editDepartment.php",
            method: "POST",
            dataType: "JSON",
            data: {
                name: capitalizedName,
                locationID: locationID,
                id: departmentID
            }
        });

        if (response.data == 'Query Failed') {
            $('#editDepartmentModal').modal('hide');
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        if ($('#department-tab').hasClass('active')) {
            getDepartments().then(() => {
                sortDepartment($('.sort').val());
                $('#editDepartmentModal').modal('hide');
                $('#success').text(`Department Successfully Updated`)
                $('#success-modal').modal('show');
                $('#success-modal').delay(1000).fadeOut('slow');

                setTimeout(() => {
                    $('#success-modal').modal('hide');
                }, 1500);
            })
        } else {
            const query = $('#search').val();
            search(query);
            $('#editDepartmentModal').modal('hide');
            $('#success').text(`Department Successfully Updated`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        }

    } catch (e) {
        throw e;
    }
}

async function sortDepartment(sortVal) {

    const departments = await getDepartments();

    if (sortVal == 'A-Z') {
        departments.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        })
        displayDepartments(departments);
    };

    if (sortVal == 'Z-A') {
        departments.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA > nameB) {
                return -1;
            }
            if (nameA < nameB) {
                return 1;
            }
            return 0;
        })
        displayDepartments(departments);
    };
}


//Add Department

$('#addDepartmentForm').on("submit", function (e) {

    // stop the default browser behviour

    e.preventDefault();

    addDepartment($('#departmentName-add').val(), $('#location-select-add').val());

})

$('#addDepartmentModal').on('show.bs.modal', async function () {

    var locations = await getLocations();

    const location = locations.map(location => {
        return `<option value="${location.id}">${location.name}</option>`
    });

    $('#location-select-add').append(location);

})

$('#addDepartmentModal').on('shown.bs.modal', function () {

    $('#departmentName-add').focus();

});

$('#addDepartmentModal').on('hidden.bs.modal', function () {

    $('#addDepartmentForm')[0].reset();

});

// Edit Department

$('#editDepartmentForm').on("submit", function (e) {

    // stop the default browser behviour

    e.preventDefault();

    editDepartment($('#departmentName-edit').val(), $('#location-select-edit').val(), $('#departmentID-edit').val());

})

$('#editDepartmentModal').on('show.bs.modal', async function (e) {


    $.ajax({
        url: "libs/php/getDepartmentByID.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
        },
        success: async function (result) {

            var resultCode = result.status.code

            if (resultCode == 200) {

                // Update the hidden input with the employee id so that
                // it can be referenced when the form is submitted

                $('#departmentName-edit').val(result.data.name);

                $('#departmentID-edit').val(result.data.id);

                var locations = await getLocations();

                const location = locations.map(location => {
                    return `<option value="${location.id}">${location.name}</option>`
                });

                $('#location-select-edit').html(location);


            } else {

                $('#editDepartmentModal .modal-title').replaceWith("Error retrieving data");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#editDepartmenteModal .modal-title').replaceWith("Error retrieving data");
        }
    });


})

$('#editDepartmentModal').on('shown.bs.modal', function () {

    $('#departmentName-edit').focus();

});

$('#editDepartmentModal').on('hidden.bs.modal', function () {

    $('#editDepartmentForm')[0].reset();

});

// Delete Department

$(document).on('click', '#deleteDept', function () {


    $.ajax({
        url: "libs/php/checkDepartmentUse.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: parseInt($(this).attr("data-id")) // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {

            console.log(result);

            if (result.status.code == 200) {


                if (result.data.departmentCount == 0) {

                    $("#areYouSureNameDept").text(result.data.departmentName);

                    $('#deleteDepartmentID').val(result.data.departmentID);

                    $('#areYouSureDeleteDeptModal').modal("show");

                } else {

                    $("#cantDeleteName").text(result.data.departmentName);
                    $("#pc").text(result.data.departmentCount + " " + 'employees ');

                    $('#cantDeleteModal').modal("show");

                }

            } else {
                $('#cantDeleteModal .modal-title').replaceWith("Error retrieving data");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            $('#cantDeleteModal .modal-title').replaceWith("Error retrieving data");
        }
    });

});

$('#confirm-delete-department').on('click', function () {

    deleteDepartment($('#deleteDepartmentID').val());

});


//Location Functions

async function getLocations() {
    try {
        const response = await $.ajax({
            url: "libs/php/getAllLocations.php",
            method: "GET"
        });

        locations = response.data;

        return locations;

    } catch (e) {
        console.log(e);
        throw (e);
    }
}

function displayLocations(locations) {

    const location = locations.map(location => {
        return `<tr>
        <td id="location-name"><i class="fa-solid fa-location-dot"></i> ${location.name}</td>
        <td class="d-none" id="location-id">${location.id}</td>
        <td><button id="editLocation" type="button" class="btn btn-secondary btn-sm editBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.id}"><i class="fa-solid fa-pen"></i></button></td>
        <td><button id="deleteLocation" type="button" class="btn btn-danger btn-sm deleteBtn" data-id="${location.id}"><i class="fa-solid fa-trash-can"></i></button></td>
     </tr>`
    })

    const locationTable = `<table class="table directory-table">${location.join('')}</table>`;

    $('.directory-table').html(locationTable);

    return location;

}

async function addLocations(name) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    try {
        const response = await $.ajax({
            url: "libs/php/insertLocation.php",
            method: "POST",
            dataType: "JSON",
            data: {
                name: capitalizedName
            }

        });


        if (response.data == 'Query Failed') {
            $('#addLocationModal').modal('hide');
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        getLocations().then(() => {
            sortLocation($('.sort').val());
            $('#addLocationModal').modal('hide');
            $('#success').text(`Location Successfully Added`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        })

    } catch (e) {
        throw e;
    }
}

async function deleteLocation(id) {
    try {
        const response = await $.ajax({
            url: "libs/php/deleteLocation.php",
            method: "POST",
            dataType: "JSON",
            data: {
                id: id
            }
        });


        if (response.data == 'Query Failed') {
            $('#areYouSureDeleteLocationModal').modal('hide');
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        if (response.data == 'Integrity Constraint Violation') {
            $('#areYouSureDeleteLocationModal').modal('hide');
            $('#failed').text(`Unable To Delete Due To Referential Integrity`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(3000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        if ($('#location-tab').hasClass('active')) {
            getLocations().then(() => {
                sortLocation($('.sort').val());
                $('#areYouSureDeleteLocationModal').modal('hide');
                $('#success').text(`Location Successfully Deleted`)
                $('#success-modal').modal('show');
                $('#success-modal').delay(1000).fadeOut('slow');

                setTimeout(() => {
                    $('#success-modal').modal('hide');
                }, 1500);
            })

        } else {
            const query = $('#search').val();
            search(query);
            $('#areYouSureDeleteLocationModal').modal('hide');
            $('#success').text(`Location Successfully Deleted`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        }

    } catch (e) {
        throw e
    }
}

async function editLocation(name, locationID) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    try {
        const response = await $.ajax({
            url: "libs/php/editLocation.php",
            method: "POST",
            dataType: "JSON",
            data: {
                name: capitalizedName,
                id: locationID
            }
        });


        if (response.data == 'Query Failed') {
            $('#editLocationModal').modal('hide');
            $('#failed').text(`Query Failed`);
            $('#failed-modal').modal('show');
            $('#failed-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#failed-modal').modal('hide');
            }, 2500);
            return;
        }

        if ($('#location-tab').hasClass('active')) {
            getLocations().then(() => {
                sortLocation($('.sort').val());
                $('#editLocationModal').modal('hide');
                $('#success').text(`Location Successfully Updated`)
                $('#success-modal').modal('show');
                $('#success-modal').delay(1000).fadeOut('slow');

                setTimeout(() => {
                    $('#success-modal').modal('hide');
                }, 1500);
            })
        } else {
            const query = $('#search').val();
            search(query);
            $('#editLocationModal').modal('hide');
            $('#success').text(`Location Successfully Updated`)
            $('#success-modal').modal('show');
            $('#success-modal').delay(1000).fadeOut('slow');

            setTimeout(() => {
                $('#success-modal').modal('hide');
            }, 1500);
        }

    } catch (e) {
        throw e;
    }
}

async function sortLocation(sortVal) {

    const locations = await getLocations();

    if (sortVal == 'A-Z') {
        locations.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        })
        displayLocations(locations);
    };

    if (sortVal == 'Z-A') {
        locations.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA > nameB) {
                return -1;
            }
            if (nameA < nameB) {
                return 1;
            }
            return 0;
        })
        displayLocations(locations);
    };
}

//Add Location

$('#addLocationForm').on("submit", function (e) {

    // stop the default browser behviour

    e.preventDefault();

    addLocations($('#locationName-add').val());

})

$('#addLocationModal').on('shown.bs.modal', function () {

    $('#locationName-add').focus();

});

$('#addLocationModal').on('hidden.bs.modal', function () {

    $('#addLocationForm')[0].reset();

});

// Edit Department

$('#editLocationForm').on("submit", function (e) {

    // stop the default browser behviour

    e.preventDefault();

    editLocation($('#locationName-edit').val(), $('#locationID-edit').val())

})

$('#editLocationModal').on('show.bs.modal', async function (e) {


    $.ajax({
        url: "libs/php/getLocationByID.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: $(e.relatedTarget).attr('data-id') // Retrieves the data-id attribute from the calling button
        },
        success: async function (result) {

            var resultCode = result.status.code

            if (resultCode == 200) {

                // Update the hidden input with the employee id so that
                // it can be referenced when the form is submitted

                $('#locationName-edit').val(result.data.name);

                $('#locationID-edit').val(result.data.id);


            } else {

                $('#editLocationModal .modal-title').replaceWith("Error retrieving data");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#editlocationModal .modal-title').replaceWith("Error retrieving data");
        }
    });


})

$('#editLocationModal').on('shown.bs.modal', function () {

    $('#locationName-edit').focus();

});

$('#editLocationModal').on('hidden.bs.modal', function () {

    $('#editLocationForm')[0].reset();

});

// Delete Location

$(document).on('click', '#deleteLocation', function () {

    $.ajax({
        url: "libs/php/checkLocationUse.php",
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: parseInt($(this).attr("data-id")) // Retrieves the data-id attribute from the calling button
        },
        success: function (result) {

            if (result.status.code == 200) {


                if (result.data.locationCount == 0) {

                    $("#areYouSureNameLocation").text(result.data.locationName);

                    $('#deleteLocationID').val(result.data.locationID);

                    $('#areYouSureDeleteLocationModal').modal("show");

                } else {

                    $("#cantDeleteName").text(result.data.locationName);
                    $("#pc").text(result.data.locationCount + " " + 'departments ');

                    $('#cantDeleteModal').modal("show");

                }

            } else {
                $('#cantDeleteModal .modal-title').replaceWith("Error retrieving data");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#cantDeleteModal .modal-title').replaceWith("Error retrieving data");
        }
    });

});

$('#confirm-delete-location').on('click', function () {

    deleteLocation($('#deleteLocationID').val())

});


//Navigation

$('.nav-link').on('click', async function (e) {
    $('#add').show();
    $('.sort').show();

    $('#search-form')[0].reset();

    if ($('#employees-tab').hasClass('active')) {
        const employees = await getPersonnel();
        displayPersonnel(employees);
        $('.sort').html(`
        <select class="form-select form-select-sm sort">
        <option value="L-F">Last-First</option>
        <option value="F-L">First-Last</option>
        </select>`);
        $('#title').html('Employees')
    }
    if ($('#department-tab').hasClass('active')) {
        const departments = await getDepartments();
        displayDepartments(departments);
        $('.sort').html(`
        <select class="form-select form-select-sm sort">
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>
        </select>`);
        sortDepartment($('.sort').val());
        $('#title').html('Departments')
    }
    if ($('#location-tab').hasClass('active')) {
        const locations = await getLocations();
        displayLocations(locations);
        $('.sort').html(`
        <option value="A-Z">A-Z</option>
        <option value="Z-A">Z-A</option>`);
        sortLocation($('.sort').val());
        $('#title').html('Locations')
    }

});

//On Load

$(window).on('load', function () {

    if ($('#preloader').length) {
        $('#preloader').delay(250).fadeOut('slow', function () {
            $(this).remove();
        });
    }

    getPersonnel().then(() => {
        displayPersonnel(employees);
    });

    getDepartments();
    getLocations();

});

// Add New 

$('#add').on('click', function (e) {

    if ($('#employees-tab').hasClass('active')) {

        $('#addEmployeeModal').modal('show');
    }

    if ($('#department-tab').hasClass('active')) {

        $('#addDepartmentModal').modal('show');

    }

    if ($('#location-tab').hasClass('active')) {

        $('#addLocationModal').modal('show');
    }

})

// Search 

function search(query) {
    const trimmedQuery = query.trim().replace(/\s+/g, '')

    $.ajax({
        url: "libs/php/search.php",
        method: "POST",
        dataType: "json",
        data: {
            query: trimmedQuery
        },
        success: function (result) {
            if (result.status.code == 200) {

                displayResults(result.data)

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })

}

async function displayResults(results) {
    var personnel;
    var department;
    var location;

    if (results.personnel) {
        const departments = await getDepartments();

        personnel = results.personnel.map(employee => {
            var department = departments.find(department => department.id == employee.departmentID);

            return `<tr>
            <td><i class="fa-solid fa-user"></i> ${employee.firstName} ${employee.lastName}</td>
            <td class="d-none d-sm-table-cell"><i class="fa-solid fa-at"></i> ${employee.email}</td>
            <td class="d-none d-sm-table-cell"><i class="fa-solid fa-briefcase"></i> ${department.name}</td>
            <td class="text-end"><button id="editEmp" type="button" class="btn btn-secondary btn-sm editBtn" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" data-id="${employee.id}"><i class="fa-solid fa-pen"></i></button></td>
            <td class="text-end"><button id="deleteEmp" type="button" class="btn btn-danger btn-sm deleteBtn" data-bs-toggle="modal" data-bs-target="#areYouSureDeleteEmpModal"" data-id="${employee.id}"><i class="fa-solid fa-trash-can"></i></button></td>   
            </tr>`
        });

    } else {
        personnel = [];
    }

    if (results.department) {
        const locations = await getLocations();

        department = results.department.map(department => {
            var location = locations.find(location => location.id == department.locationID);
            return `<tr>
            <td><i class="fa-solid fa-briefcase"></i> ${department.name}</td>
            <td class="d-none d-sm-table-cell">                     </td>
            <td class="d-none d-sm-table-cell"><i class="fa-solid fa-location-dot"></i> ${location.name}</td>
            <td class="text-end"><button id="editDept" type="button" class="btn btn-secondary btn-sm editBtn" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id="${department.id}"><i class="fa-solid fa-pen"></i></button></td>
            <td class="text-end"><button id="deleteDept" type="button" class="btn btn-danger btn-sm deleteBtn" data-id="${department.id}"><i class="fa-solid fa-trash-can"></i></button></td>
         </tr>`

        })

    } else {
        department = [];
    }

    if (results.location) {
        location = results.location.map(location => {
            return `<tr>
            <td id="location-name"><i class="fa-solid fa-location-dot"></i> ${location.name}</td>
            <td class="d-none d-sm-table-cell"></td>
            <td class="d-none d-sm-table-cell"></td>
            <td class="text-end"><button id="editLocation" type="button" class="btn btn-secondary btn-sm editBtn" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.id}"><i class="fa-solid fa-pen"></i></button></td>
            <td class="text-end"><button id="deleteLocation" type="button" class="btn btn-danger btn-sm deleteBtn"  data-id="${location.id}"><i class="fa-solid fa-trash-can"></i
         </tr>`
        })
    } else {
        location = [];
    }

    const searchResults = `<table class="table directory-table">${personnel.join('')}${department.join('')}${location.join('')}</table>`;

    $('.directory-table').html(searchResults);
}

$('#search-form').on('submit', function (e) {
    $('#employees-tab').removeClass('active')
    $('#department-tab').removeClass('active')
    $('#location-tab').removeClass('active')
    $('#add').hide();
    $('sort').hide();
    $('#title').text('Search Results...')
    e.preventDefault();
    const query = $('#search').val();
    search(query);
})

// Sort

$(document).on('change', '.sort', function () {


    if ($('#employees-tab').hasClass('active')) {
        sortPersonnel($('.sort').val());
    }

    if ($('#department-tab').hasClass('active')) {
        sortDepartment($('.sort').val());
    }

    if ($('#location-tab').hasClass('active')) {
        sortLocation($('.sort').val());
    }
});