package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/koyashiro/postgres-playground/backend/handler"
	"github.com/koyashiro/postgres-playground/backend/repository"
	"github.com/koyashiro/postgres-playground/backend/service"
)

const port = "1323"

func main() {
	// Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// TODO: replace DI
	cr, err := repository.NewContainerRepository()
	if err != nil {
		panic(err)
	}
	rr := repository.NewRDBMSRepository()
	ps := service.NewPlaygroundService(cr, rr)
	ph := handler.NewPlaygroundsHandler(ps)

	// Routes
	e.GET("/playgrounds", ph.GetPlaygrounds)
	e.GET("/playgrounds/:id", ph.GetPlayground)
	e.POST("/playgrounds", ph.PostPlayground)
	e.DELETE("/playgrounds/:id", ph.DeletePlayground)
	e.POST("/playgrounds/:id/query", ph.ExecuteQuery)

	// Start server
	e.Logger.Fatal(e.Start(":" + port))
}
